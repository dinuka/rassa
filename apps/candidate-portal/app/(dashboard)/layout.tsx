"use client";

import { useState } from "react";

import { SessionProvider } from "next-auth/react";

import { X } from "lucide-react";

import { cn } from "@repo/ui";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="bg-background flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="fixed inset-y-0 left-0 w-64" onClick={(e) => e.stopPropagation()}>
              <Sidebar />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="bg-sidebar-accent text-sidebar-foreground absolute top-4 right-4 rounded-lg p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
