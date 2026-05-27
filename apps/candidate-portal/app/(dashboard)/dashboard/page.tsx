import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

import DashboardContent from "./DashboardContent";

export const metadata = {
  title: "Dashboard - Rassa",
  description: "Your personalized job matching dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const res = await fetch(`${env.apiUrl}/users/me/stats`, {
    headers: { Authorization: `Bearer ${session.accessToken}` },
    cache: "no-store",
  });

  const stats = res.ok
    ? await res.json()
    : { cvComplete: false, applicationsCount: 0, invitationsCount: 0, matchedJobs: 0 };

  return <DashboardContent user={session.user} stats={stats} />;
}
