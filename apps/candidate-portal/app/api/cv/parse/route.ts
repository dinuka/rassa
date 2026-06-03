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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file instanceof File ? file.name : "unknown";
    const fileSize = file instanceof File ? file.size : undefined;
    logger.debug({ fileName, fileSize }, "CV parse request received");

    const upstream = new FormData();
    upstream.append("file", file);

    const res = await fetch(`${env.apiUrl}/cv-documents/parse`, {
      method: "POST",
      headers: { Authorization: `Bearer ${session.accessToken}` },
      body: upstream,
    });

    if (!res.ok) {
      const error = await res.text();
      logger.warn({ status: res.status, error }, "Backend returned error for CV parse");
      return NextResponse.json({ error }, { status: res.status });
    }

    const { jobId } = (await res.json()) as { jobId: string };
    logger.debug({ fileName, jobId }, "CV parse job enqueued");
    return NextResponse.json({ jobId });
  } catch (error) {
    logger.error(error, "Error enqueuing CV parse");
    return NextResponse.json({ error: "Failed to start CV parse" }, { status: 500 });
  }
}
