import { NextRequest } from "next/server";

import env from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${env.apiUrl}/ai/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(res.body, { headers: { "Content-Type": "text/event-stream" } });
}
