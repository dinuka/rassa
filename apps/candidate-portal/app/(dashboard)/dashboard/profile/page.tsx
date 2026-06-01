import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

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

  return <ProfileContent user={session.user} cv={undefined} />;
}
