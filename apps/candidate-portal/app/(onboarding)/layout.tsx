"use client";

import { LogOut, Sparkles } from "lucide-react";

import { useLogout } from "@repo/auth";
import { SessionProvider } from "next-auth/react";

function OnboardingHeader() {
  const logout = useLogout();

  return (
    <header className="border-border bg-card/50 sticky top-0 z-50 border-b backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Sparkles className="text-primary-foreground h-4 w-4" />
          </div>
          <span className="text-foreground text-lg font-semibold">Rassa</span>
        </div>
        <button
          onClick={logout}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </header>
  );
}

const OnboardingLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <div className="bg-background min-h-screen">
      <OnboardingHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
    </div>
  </SessionProvider>
);

export default OnboardingLayout;
