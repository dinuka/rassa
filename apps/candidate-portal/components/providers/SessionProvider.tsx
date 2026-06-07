"use client";

import { useEffect } from "react";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider, signOut, useSession } from "next-auth/react";

const SessionErrorWatcher = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/signin" });
    }
  }, [session?.error]);

  return null;
};

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session;
}

const SessionProvider = ({ children, session }: SessionProviderProps) => (
  <NextAuthSessionProvider session={session}>
    <SessionErrorWatcher />
    {children}
  </NextAuthSessionProvider>
);

export default SessionProvider;
