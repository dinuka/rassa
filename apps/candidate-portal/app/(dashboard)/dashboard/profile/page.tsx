import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileContent } from "./profile-content";
import { getDatabase } from "@/lib/mongodb";

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

  return <ProfileContent user={session.user} cv={cv} />;
}
