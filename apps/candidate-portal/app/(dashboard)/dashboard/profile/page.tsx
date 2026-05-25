import { redirect } from "next/navigation";

import type { CV } from "@repo/shared-types";

import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

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

  const db = await getDatabase();
  const cv = await db.collection("cvs").findOne({
    userId: session.user.id,
    isActive: true,
  });

  return <ProfileContent user={session.user} cv={(cv as unknown as CV) ?? undefined} />;
}
