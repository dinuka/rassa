import { redirect } from "next/navigation";

import { Sparkles } from "lucide-react";

import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/mongodb";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background min-h-screen">
      <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Sparkles className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="text-foreground text-lg font-semibold">Rassa</span>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  );
}
