import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobDetailContent } from "./job-detail-content";

export const metadata = {
  title: "Job Details - Rassa",
  description: "View job details and match analysis",
};

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect("/signin");
  }

  return <JobDetailContent jobId={id} />;
}
