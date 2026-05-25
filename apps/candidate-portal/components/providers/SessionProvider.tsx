"use client";

import type { Session } from "next-auth";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session;
}

const SessionProvider = ({ children, session }: SessionProviderProps) => (
  <NextAuthSessionProvider session={session}>{children}</NextAuthSessionProvider>
);

export default SessionProvider;
