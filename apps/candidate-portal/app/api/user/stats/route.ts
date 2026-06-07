import { NextResponse } from "next/server";

import { logger } from "@repo/logger";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${env.apiUrl}/users/me/stats`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    logger.error(error, "Error fetching user stats");
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
