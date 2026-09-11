import type { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse & { json?: (data: any) => void; status?: (code: number) => any }) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString(), platform: "vercel" }));
}
