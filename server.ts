import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "observx-kinetic-secret-2026";

interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  email: string;
  nodeRole?: string;
  nodeLoc?: string;
  securityQuestion: string;
  securityAnswerHash: string;
}

// In-memory user database
const users: User[] = [
  // Default user for testing purposes
  {
    id: "user-admin",
    username: "admin",
    passwordHash: bcrypt.hashSync("admin123", 10),
    createdAt: new Date().toISOString(),
    email: "admin@observx.io",
    nodeRole: "System Auditor",
    nodeLoc: "Core Lattice-01",
    securityQuestion: "What is your first terminal?",
    securityAnswerHash: bcrypt.hashSync("termux", 10)
  }
];

// JWT Authentication Middleware
const authenticateToken = (req: any, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired access token" });
    }
    req.user = decoded;
    next();
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware for JSON body parsing
  app.use(express.json());

  // --- API Authentication Routes ---

  // User Registration
  app.post("/api/register", (req, res) => {
    const { username, password, email, securityQuestion, securityAnswer, nodeRole, nodeLoc } = req.body;

    if (!username || !password || !email || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ error: "Username, password, email, security question, and answer are required" });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({ error: "Username must be >= 3 chars, password >= 6 chars" });
    }

    const existingUser = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    try {
      const passwordHash = bcrypt.hashSync(password, 10);
      const securityAnswerHash = bcrypt.hashSync(securityAnswer.toLowerCase().trim(), 10);
      const newUser: User = {
        id: `user-${Date.now()}`,
        username,
        passwordHash,
        createdAt: new Date().toISOString(),
        email,
        nodeRole: nodeRole || "Infrastructure Officer",
        nodeLoc: nodeLoc || "Remote Ingress",
        securityQuestion,
        securityAnswerHash
      };

      users.push(newUser);
      
      // Also return a pre-generated token for immediate sign-in upon registration
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: { username: newUser.username }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to securely register user" });
    }
  });

  // User Login
  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    try {
      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({
        success: true,
        message: "Authentication successful",
        token,
        user: { username: user.username }
      });
    } catch (error) {
      res.status(500).json({ error: "Authentication processing failed" });
    }
  });

  // Check Username recovery question
  app.post("/api/forgot-password-check", (req, res) => {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Username not registered in the grid" });
    }
    res.json({
      username: user.username,
      securityQuestion: user.securityQuestion
    });
  });

  // Reset Password using Recovery Question
  app.post("/api/reset-password", (req, res) => {
    const { username, securityAnswer, newPassword } = req.body;
    if (!username || !securityAnswer || !newPassword) {
      return res.status(400).json({ error: "All recovery parameters are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be >= 6 characters" });
    }
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }
    try {
      const isAnswerValid = bcrypt.compareSync(securityAnswer.toLowerCase().trim(), user.securityAnswerHash);
      if (!isAnswerValid) {
        return res.status(401).json({ error: "Incorrect security recovery answer" });
      }
      user.passwordHash = bcrypt.hashSync(newPassword, 10);
      res.json({
        success: true,
        message: "Password reset completed successfully. Please login."
      });
    } catch (error) {
      res.status(500).json({ error: "Reset cryptographic validation failed" });
    }
  });

  // GET User Profile details
  app.get("/api/profile", authenticateToken, (req: any, res) => {
    const user = users.find(u => u.username.toLowerCase() === req.user.username.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }
    res.json({
      username: user.username,
      email: user.email,
      nodeRole: user.nodeRole,
      nodeLoc: user.nodeLoc,
      createdAt: user.createdAt,
      securityQuestion: user.securityQuestion
    });
  });

  // PUT Update User Profile details
  app.put("/api/profile", authenticateToken, (req: any, res) => {
    const { email, nodeRole, nodeLoc, securityQuestion, securityAnswer } = req.body;
    const user = users.find(u => u.username.toLowerCase() === req.user.username.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }

    if (email) {
      user.email = email;
    }
    if (nodeRole) {
      user.nodeRole = nodeRole;
    }
    if (nodeLoc) {
      user.nodeLoc = nodeLoc;
    }
    if (securityQuestion && securityAnswer) {
      user.securityQuestion = securityQuestion;
      user.securityAnswerHash = bcrypt.hashSync(securityAnswer.toLowerCase().trim(), 10);
    }

    res.json({
      success: true,
      message: "Node profile updated successfully",
      profile: {
        username: user.username,
        email: user.email,
        nodeRole: user.nodeRole,
        nodeLoc: user.nodeLoc,
        createdAt: user.createdAt,
        securityQuestion: user.securityQuestion
      }
    });
  });

  // POST Change Password
  app.post("/api/profile/change-password", authenticateToken, (req: any, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new passwords are required" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "New password must be >= 6 characters" });
    }

    const user = users.find(u => u.username.toLowerCase() === req.user.username.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: "User profile not found" });
    }

    try {
      const isPasswordValid = bcrypt.compareSync(currentPassword, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Incorrect current password" });
      }

      user.passwordHash = bcrypt.hashSync(newPassword, 10);
      res.json({
        success: true,
        message: "Password changed successfully"
      });
    } catch (error) {
      res.status(500).json({ error: "Cryptographic state transition error" });
    }
  });

  // User Logout (stateless info, client deletes token)
  app.post("/api/logout", (req, res) => {
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });

  // Public Endpoint
  app.get("/api/hello", (req, res) => {
    res.json({ 
      message: "Hello from the ObservX public server!",
      timestamp: new Date().toISOString(),
      status: "success"
    });
  });

  // Protected Telemetry/Audit Endpoint
  app.get("/api/telemetry", authenticateToken, (req: any, res) => {
    res.json({
      status: "SECURE",
      authUsername: req.user.username,
      nodeId: req.user.id,
      timestamp: new Date().toISOString(),
      kernelDiagnostics: {
        latticeSymmetry: "PERFECT",
        divergenceScore: 0.02,
        vesselAero: "ACTIVE_SECURED",
        securedLogCount: 142,
        protocolVersion: "2.0.4-JWT"
      },
      activeDockets: [
        "Termux auto-sync secured validation",
        "Paralegal protocol locked under token: JWT_HS256"
      ]
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
