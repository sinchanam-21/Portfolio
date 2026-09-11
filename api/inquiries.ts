import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(
  req: IncomingMessage & { body?: any; method?: string },
  res: ServerResponse
) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method === "POST") {
    try {
      let body = req.body;
      if (!body || typeof body === "string") {
        const buffers = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const raw = Buffer.concat(buffers).toString("utf-8");
        if (raw) {
          body = JSON.parse(raw);
        }
      }

      if (body && body.name && body.email && body.message) {
        res.statusCode = 200;
        return res.end(JSON.stringify({ success: true, message: "Inquiry received on Vercel" }));
      }
    } catch {
      // ignore
    }

    res.statusCode = 400;
    return res.end(JSON.stringify({ success: false, message: "Missing required inquiry fields" }));
  }

  res.statusCode = 405;
  return res.end(JSON.stringify({ message: "Method Not Allowed" }));
}
