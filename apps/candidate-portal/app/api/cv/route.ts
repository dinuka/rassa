import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const db = await getDatabase();

    // Create CV document
    const cv = {
      userId: session.user.id,
      version: 1,
      isActive: true,
      personalInfo: body.personalInfo || {},
      experience: body.experience || [],
      education: body.education || [],
      skills: body.skills || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("cvs").insertOne(cv);

    return NextResponse.json({
      success: true,
      cvId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating CV:", error);
    return NextResponse.json(
      { error: "Failed to create CV" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const cv = await db.collection("cvs").findOne({
      userId: session.user.id,
      isActive: true,
    });

    if (!cv) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    return NextResponse.json({ cv });
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      { error: "Failed to fetch CV" },
      { status: 500 }
    );
  }
}
