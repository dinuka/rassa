import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { SetupWizard } from "./setup-wizard";

export const metadata = {
  title: "Setup Your Profile - Rassa",
  description: "Complete your profile setup to get started",
};

export default async function SetupPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  // Check if already completed onboarding
  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (user?.onboardingComplete) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {session.user.name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Let&apos;s set up your profile to find the perfect opportunities
        </p>
      </div>

      <SetupWizard user={session.user} />
    </div>
  );
}
