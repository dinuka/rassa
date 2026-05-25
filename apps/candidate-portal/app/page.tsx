import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  // Check if user has completed onboarding
  const db = await getDatabase();
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user?.onboardingComplete) {
    redirect("/setup");
  }

  // If onboarding complete, redirect to dashboard
  redirect("/dashboard");
}
