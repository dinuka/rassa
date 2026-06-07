import { NextRequest, NextResponse } from "next/server";

import { logger } from "@repo/logger";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobId } = await params;

    const res = await fetch(`${env.apiUrl}/cv-documents/parse/${jobId}/status`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });

    if (!res.ok) {
      const error = await res.text();
      logger.warn(
        { status: res.status, jobId, error },
        "Backend returned error for CV parse status",
      );
      return NextResponse.json({ error }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch (error) {
    logger.error(error, "Error fetching CV parse status");
    return NextResponse.json({ error: "Failed to fetch parse status" }, { status: 500 });
  }
}
