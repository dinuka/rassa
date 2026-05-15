import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApplicationsContent } from "./applications-content";

export const metadata = {
  title: "My Applications - Rassa",
  description: "Track your job applications",
};

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <ApplicationsContent />;
}
