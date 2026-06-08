import { NextResponse } from "next/server";

import { logger } from "@repo/logger";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${env.apiUrl}/users/me/complete-onboarding`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error({ status: res.status, body }, "Backend complete-onboarding failed");
      return NextResponse.json({ error: "Failed to complete onboarding" }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error, "Error completing onboarding");
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
