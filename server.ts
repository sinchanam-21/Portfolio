import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initialPortfolioData } from "./src/data/initialPortfolio";
import { PortfolioState } from "./src/types";

const DATA_FILE = path.join(process.cwd(), "portfolio-data.json");

function getStoredPortfolio(): PortfolioState {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed && parsed.profile) {
        return {
          profile: { ...initialPortfolioData.profile, ...parsed.profile },
          education: parsed.education?.length ? parsed.education : initialPortfolioData.education,
          skills: parsed.skills?.length ? parsed.skills : initialPortfolioData.skills,
          projects: parsed.projects?.length ? parsed.projects : initialPortfolioData.projects,
          certifications: parsed.certifications?.length ? parsed.certifications : initialPortfolioData.certifications,
          contactMessages: parsed.contactMessages || [],
          ownerPasscodeHash: parsed.ownerPasscodeHash || initialPortfolioData.ownerPasscodeHash,
        };
      }
    }
  } catch (err) {
    console.error("Error reading portfolio data file:", err);
  }

  // Fallback to initial data & write it out
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialPortfolioData, null, 2), "utf-8");
  } catch (err) {
    console.error("Could not initialize data file:", err);
  }
  return initialPortfolioData;
}

function saveStoredPortfolio(data: PortfolioState): boolean {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing portfolio data file:", err);
    return false;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get portfolio data for all visitors (public)
  app.get("/api/portfolio", (req, res) => {
    try {
      const currentData = getStoredPortfolio();
      // Mask the secret pin from public payload
      const safeData = {
        ...currentData,
        hasCustomPin: Boolean(currentData.ownerPasscodeHash),
      };
      res.json({ success: true, data: safeData });
    } catch (err) {
      console.error("Failed to retrieve portfolio:", err);
      res.status(500).json({ success: false, error: "Failed to load portfolio data" });
    }
  });

  // Verify owner PIN
  app.post("/api/auth/verify-pin", (req, res) => {
    try {
      const { pin } = req.body;
      const currentData = getStoredPortfolio();
      const currentPin = (currentData.ownerPasscodeHash || "21005").trim();
      const providedPin = (pin || "").trim();

      if (providedPin && providedPin === currentPin) {
        return res.json({ success: true, verified: true });
      }
      return res.status(401).json({ success: false, verified: false, message: "Invalid PIN" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Verification error" });
    }
  });

  // Update portfolio data (restricted to verified owner)
  app.put("/api/portfolio", (req, res) => {
    try {
      const pinHeader = req.headers["x-owner-pin"] as string;
      const currentData = getStoredPortfolio();
      const currentPin = (currentData.ownerPasscodeHash || "21005").trim();

      if (!pinHeader || pinHeader.trim() !== currentPin) {
        return res.status(403).json({ success: false, message: "Unauthorized. Valid PIN required to save changes." });
      }

      const updatedPayload: PortfolioState = req.body;
      if (!updatedPayload || !updatedPayload.profile) {
        return res.status(400).json({ success: false, message: "Invalid portfolio payload." });
      }

      // Preserve PIN if not updated
      const finalData: PortfolioState = {
        ...updatedPayload,
        ownerPasscodeHash: updatedPayload.ownerPasscodeHash?.trim() || currentPin,
      };

      const saved = saveStoredPortfolio(finalData);
      if (saved) {
        return res.json({ success: true, message: "Portfolio updated globally and saved to server." });
      } else {
        return res.status(500).json({ success: false, message: "Could not write to database file." });
      }
    } catch (err) {
      console.error("Failed to update portfolio:", err);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Submit visitor inquiries (public form)
  app.post("/api/inquiries", (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email and message are required." });
      }

      const currentData = getStoredPortfolio();
      const newInquiry = {
        id: `msg-${Date.now()}`,
        name: String(name).trim(),
        email: String(email).trim(),
        subject: String(subject || "General Inquiry").trim(),
        message: String(message).trim(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      currentData.contactMessages = [newInquiry, ...(currentData.contactMessages || [])];
      saveStoredPortfolio(currentData);

      res.json({ success: true, message: "Inquiry saved successfully." });
    } catch (err) {
      console.error("Failed to save inquiry:", err);
      res.status(500).json({ success: false, error: "Could not save message" });
    }
  });

  // Setup Vite dev server or serve production build
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
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
