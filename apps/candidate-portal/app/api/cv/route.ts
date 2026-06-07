import { NextRequest, NextResponse } from "next/server";

import { logger } from "@repo/logger";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(`${env.apiUrl}/cv-documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to create CV" }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    logger.error(error, "Error creating CV");
    return NextResponse.json({ error: "Failed to create CV" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${env.apiUrl}/cv-documents/me`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "CV not found" }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    logger.error(error, "Error fetching CV");
    return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 });
  }
}
