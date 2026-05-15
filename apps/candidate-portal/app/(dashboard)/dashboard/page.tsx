import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { DashboardContent } from "./dashboard-content";

export const metadata = {
  title: "Dashboard - Rassa",
  description: "Your personalized job matching dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const db = await getDatabase();
  
  // Fetch user stats
  const [cv, applicationsCount, invitationsCount] = await Promise.all([
    db.collection("cvs").findOne({ userId: session.user.id, isActive: true }),
    db.collection("applications").countDocuments({ userId: session.user.id }),
    db.collection("invitations").countDocuments({ userId: session.user.id, status: "pending" }),
  ]);

  const stats = {
    cvComplete: !!cv,
    applicationsCount,
    invitationsCount,
    matchedJobs: 24, // Mock data - would come from matching service
  };

  return <DashboardContent user={session.user} stats={stats} />;
}
