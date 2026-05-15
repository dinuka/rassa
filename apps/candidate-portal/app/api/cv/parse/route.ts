import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // In a real implementation, this would:
    // 1. Upload to storage (Vercel Blob, S3, etc.)
    // 2. Call AI service to parse the CV
    // 3. Return structured data

    // For now, return mock data structure
    const mockCVData = {
      cv: {
        personalInfo: {
          fullName: session.user.name || "",
          email: session.user.email || "",
          phone: "",
          location: "",
          title: "Software Engineer",
          summary: "Experienced software engineer with expertise in building scalable applications.",
        },
        experience: [
          {
            id: crypto.randomUUID(),
            company: "Tech Company",
            title: "Senior Software Engineer",
            location: "San Francisco, CA",
            startDate: "2022-01",
            endDate: "",
            current: true,
            description: "Leading development of core platform features.",
            highlights: [],
          },
        ],
        education: [
          {
            id: crypto.randomUUID(),
            institution: "University",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2014",
            endDate: "2018",
            gpa: "",
          },
        ],
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python"],
      },
    };

    return NextResponse.json(mockCVData);
  } catch (error) {
    console.error("Error parsing CV:", error);
    return NextResponse.json(
      { error: "Failed to parse CV" },
      { status: 500 }
    );
  }
}
