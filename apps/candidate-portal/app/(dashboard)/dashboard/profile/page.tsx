import { redirect } from "next/navigation";

import type { CandidateProfile } from "@repo/shared-types";

import { auth } from "@/lib/auth";
import env from "@/lib/env";

import ProfileContent from "./ProfileContent";

export const metadata = {
  title: "My Profile - Rassa",
  description: "Manage your profile and CV",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  let profile: CandidateProfile | undefined;

  if (session.accessToken) {
    const res = await fetch(`${env.apiUrl}/candidate/profile`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
    });
    if (res.ok) {
      profile = await res.json();
    }
  }

  return <ProfileContent user={session.user} profile={profile} />;
}
