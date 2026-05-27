import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

export const POST = async () => {
  const session = await auth();
  if (session?.refreshToken) {
    try {
      await fetch(`${env.apiUrl}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: session.refreshToken }),
      });
    } catch {
      // Backend errors don't block logout
    }
  }
  return NextResponse.json({ success: true });
};
