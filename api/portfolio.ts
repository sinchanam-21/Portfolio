import type { IncomingMessage, ServerResponse } from "http";
import { initialPortfolioData } from "../src/data/initialPortfolio";
import { PortfolioState } from "../src/types";

// In-memory cache for Vercel serverless execution
let cachedPortfolio: PortfolioState = { ...initialPortfolioData };

export default async function handler(
  req: IncomingMessage & { body?: any; query?: any; method?: string; headers: any },
  res: ServerResponse & { json?: (data: any) => void; status?: (code: number) => any }
) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-owner-pin");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method === "GET") {
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        success: true,
        data: cachedPortfolio,
      })
    );
  }

  if (req.method === "PUT") {
    const pin = req.headers["x-owner-pin"];
    const currentPin = (cachedPortfolio.ownerPasscodeHash || "21005").trim();

    if (!pin || String(pin).trim() !== currentPin) {
      res.statusCode = 403;
      return res.end(JSON.stringify({ success: false, message: "Unauthorized. Invalid PIN." }));
    }

    try {
      // If Vercel already parsed the body
      let payload = req.body;
      if (!payload || typeof payload === "string") {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const raw = Buffer.concat(buffers).toString("utf-8");
        if (raw) {
          payload = JSON.parse(raw);
        }
      }

      if (payload && payload.profile) {
        cachedPortfolio = {
          ...payload,
          ownerPasscodeHash: payload.ownerPasscodeHash || currentPin,
        };
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: "Updated on Vercel deployment" }));
      }
    } catch (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ success: false, message: "Invalid payload" }));
    }
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ message: "Method Not Allowed" }));
}
