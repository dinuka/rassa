"use client";

import { SessionProvider } from "next-auth/react";

import Header from "@/components/dashboard/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>
    <div className="bg-background flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-6">{children}</main>
    </div>
  </SessionProvider>
);

export default DashboardLayout;
