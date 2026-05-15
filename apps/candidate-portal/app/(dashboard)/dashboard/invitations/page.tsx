import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { InvitationsContent } from "./invitations-content";

export const metadata = {
  title: "Invitations - Rassa",
  description: "Review company invitations",
};

export default async function InvitationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return <InvitationsContent />;
}
