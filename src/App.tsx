import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Rocket, 
  Server, 
  Layout, 
  Code, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Github,
  Zap,
  FileCode,
  Folder,
  Settings,
  Terminal as TerminalIcon,
  Activity
} from "lucide-react";

interface StatusData {
  message: string;
  timestamp: string;
  status: string;
}

export default function App() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/hello");
      if (!response.ok) throw new Error("Failed to connect to server");
      const json = await response.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#030308] text-foreground font-sans overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-accent/10 blur-[100px] rounded-full" />
      </div>

      {/* Left Sidebar: File Explorer Pattern */}
      <aside className="w-64 border-r border-border flex flex-col bg-[#050510]/80 backdrop-blur-xl shrink-0 hidden md:flex z-10">
        <div className="h-12 flex items-center px-4 border-b border-border text-[10px] font-bold tracking-[0.3em] uppercase text-primary/80">
          Aether Core
        </div>
        <div className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground"><Folder className="w-4 h-4" /> cosmic-nodes</div>
          <div className="flex items-center gap-2 px-6 py-1.5 text-xs bg-primary/10 rounded text-foreground border border-primary/20"><FileCode className="w-4 h-4 text-primary" /> Core.tsx</div>
          <div className="flex items-center gap-2 px-6 py-1.5 text-xs opacity-60"><FileCode className="w-4 h-4" /> engine.css</div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground mt-4"><Folder className="w-4 h-4" /> aether-link</div>
          <div className="flex items-center gap-2 px-6 py-1.5 text-xs opacity-60"><FileCode className="w-4 h-4" /> server.ts</div>
          <div className="flex items-center gap-2 px-3 py-1.5 text-xs opacity-60 mt-6"><Settings className="w-4 h-4" /> cosmic.config.js</div>
        </div>
        <div className="p-4 border-t border-border bg-card/10">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-accent tracking-widest">
            <span>Aether Link</span>
            <span className="flex items-center gap-1">v2.0.4 <Activity className="w-2.5 h-2.5" /></span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Navigation Bar: Tab Pattern */}
        <nav className="h-12 border-b border-border flex items-center bg-[#080815]/90 backdrop-blur-md shrink-0 px-4 gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 border-b-2 border-primary h-full px-4 text-xs font-medium text-foreground whitespace-nowrap bg-primary/5">
            <FileCode className="h-3 w-3 text-primary" /> Core.tsx
          </div>
          <div className="text-xs opacity-40 hover:opacity-80 transition-opacity cursor-pointer px-4 whitespace-nowrap">Engine.ts</div>
          
          <div className="ml-auto flex items-center gap-3 pl-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-[0.1em]">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)] ${loading ? "bg-yellow-500 animate-pulse" : "bg-primary"}`}></span>
              {loading ? "Aligning" : "Synchronized"}
            </div>
            <button className="bg-primary hover:bg-primary/80 text-primary-foreground px-4 py-1 rounded text-xs font-bold transition-all uppercase tracking-tighter shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-primary/50">
              Ascend
            </button>
          </div>
        </nav>

        {/* Content View */}
        <section className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gradient-to-br from-[#030308] to-[#050515]">
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto border-r border-border custom-scrollbar">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-accent/20">
                  <Zap className="w-3 h-3 fill-accent/20" /> Celestial Protocol
                </div>
                <h1 className="text-4xl font-extrabold tracking-[-0.04em] mb-4 text-balance sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-primary">
                  Aetherium Cosmic <br />
                  <span className="italic font-normal opacity-90 font-serif">Core Engine</span>
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  Harness the power of the aether with our high-fidelity, celestial compute engine. 
                  Real-time telemetry and synchronous node alignment across the cosmic network.
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2 mb-12">
                <StatusCard 
                  title="Aether Link"
                  status={loading ? "loading" : error ? "error" : "success"}
                  icon={<Server className="w-5 h-5" />}
                  onRefresh={fetchStatus}
                />
                <StatusCard 
                  title="Celestial Flare"
                  status="success"
                  icon={<Rocket className="w-5 h-5" />}
                  onRefresh={() => {}}
                />
              </div>

              {/* Data Visualization Section */}
              <div className="rounded-2xl border bg-[#0A0A1F]/40 backdrop-blur-sm p-6 border-primary/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Telemetry Stream
                  </h3>
                </div>
                
                <div className="bg-[#050510]/80 rounded-lg border border-border/50 p-5 font-mono text-xs overflow-x-auto shadow-inner">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-primary/60 italic flex items-center gap-3"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Awaiting node alignment...
                      </motion.div>
                    ) : (
                      <motion.pre
                        key="data"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-primary/90"
                      >
                        {JSON.stringify(data || { status: "AETHER_LINK_DISCONNECTED" }, null, 2)}
                      </motion.pre>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Config/Details */}
          <aside className="w-full md:w-72 bg-[#080815]/80 backdrop-blur-xl shrink-0 flex flex-col border-t md:border-t-0 p-6 z-10">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-6">System Nodes</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-bold mb-3 block tracking-widest">Resonance Ports</label>
                <div className="space-y-2">
                  <ConfigItem label="Aether Base" value="3000" />
                  <ConfigItem label="Shadow Link" value="3001" isProxy />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-muted-foreground uppercase font-bold mb-3 block tracking-widest">Protocol Stats</label>
                <div className="flex flex-wrap gap-2">
                  <CapabilityBadge label="CELESTIAL" />
                  <CapabilityBadge label="AETHER-2.0" />
                  <CapabilityBadge label="VOID-SYMMETRY" />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-border/50">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 group cursor-default hover:bg-primary/10 transition-colors">
                  <Zap className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(139,92,246,0.4)]" />
                  <div className="text-[10px] leading-tight">
                    <div className="font-bold text-foreground">Cosmic Core</div>
                    <div className="text-muted-foreground">Alignment: 99.98%</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* Terminal Section Pattern */}
        <footer className="h-40 border-t border-border bg-[#050510] p-4 relative overflow-hidden shrink-0 hidden sm:block">
          <div className="flex items-center gap-6 mb-3 border-b border-border pb-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="text-primary border-b border-primary pb-2 flex items-center gap-2">
              <TerminalIcon className="w-3 h-3 text-primary h-[8px]" /> Command Trace
            </span>
            <span className="opacity-40 hover:opacity-100 transition-opacity cursor-pointer">Ethereal Log</span>
          </div>
          <div className="font-mono text-[11px] space-y-1.5 overflow-y-auto h-24 custom-scrollbar pr-2">
            <div className="text-primary opacity-60">Initializing Aetherium Cosmic Core...</div>
            <div className="text-accent opacity-60">[protocol] nexus established at shadow-point-3001</div>
            <div className="text-muted-foreground opacity-40">[system] celestial balance initialized</div>
            <div className="text-primary/80">
              {loading ? "> TRACE_LINK (pending...)" : `> LINK_ACK (200) - ${data?.status || "disconnected"}`}
            </div>
            <div className="inline-block w-2 h-4 bg-primary/40 animate-pulse ml-1 vertical-middle shadow-[0_0_5px_rgba(139,92,246,0.5)]" />
          </div>
        </footer>
      </main>
    </div>
  );
}

function StatusCard({ title, status, icon, onRefresh }: { title: string; status: "loading" | "success" | "error"; icon: React.ReactNode; onRefresh: () => void }) {
  return (
    <div className="rounded-lg border bg-card p-4 hover:border-primary/50 transition-colors group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded bg-secondary text-foreground group-hover:text-primary transition-colors">
          {icon}
        </div>
        <button onClick={onRefresh} className="p-1 hover:bg-secondary rounded transition-colors text-muted-foreground">
          <RefreshCw className={`w-3 h-3 ${status === "loading" ? "animate-spin" : ""}`} />
        </button>
      </div>
      <h3 className="text-sm font-bold mb-1">{title}</h3>
      <div className="flex items-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${status === "success" ? "bg-green-500" : status === "error" ? "bg-destructive" : "bg-yellow-500"}`} />
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
          {status === "success" ? "Online" : status === "error" ? "Error" : "Syncing"}
        </span>
      </div>
    </div>
  );
}

function ConfigItem({ label, value, isProxy }: { label: string; value: string; isProxy?: boolean }) {
  return (
    <div className="flex justify-between items-center bg-background/50 border border-border/50 rounded px-2 py-1.5">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <span className={`font-mono text-xs ${isProxy ? "text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

function CapabilityBadge({ label }: { label: string }) {
  return (
    <span className="px-2 py-0.5 rounded bg-secondary/50 border border-border/50 text-[9px] font-bold uppercase tracking-tighter text-muted-foreground">
      {label}
    </span>
  );
}
