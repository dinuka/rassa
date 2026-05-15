import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JobsContent } from "./jobs-content";

export const metadata = {
  title: "Job Matches - Rassa",
  description: "Browse jobs that match your profile",
};

export default async function JobsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <JobsContent />;
}
