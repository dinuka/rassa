import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import JobsContent from "./JobsContent";

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
