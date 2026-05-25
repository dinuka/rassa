"use client";

import { useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Sparkles,
  User,
  Wrench,
} from "lucide-react";

import { cn } from "@repo/ui";
import { Avatar, Button, Separator } from "@repo/ui";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Jobs", href: "/dashboard/jobs", icon: Briefcase },
  { name: "Applications", href: "/dashboard/applications", icon: FileText },
  { name: "Invitations", href: "/dashboard/invitations", icon: Mail },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "AI Tools", href: "/dashboard/tools", icon: Wrench },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <aside
      className={cn(
        "bg-sidebar border-sidebar-border flex h-screen flex-col border-r transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="border-sidebar-border flex h-16 items-center gap-3 border-b px-4">
        <div className="bg-sidebar-primary flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg">
          <Sparkles className="text-sidebar-primary-foreground h-5 w-5" />
        </div>
        {!collapsed && <span className="text-sidebar-foreground text-lg font-semibold">Rassa</span>}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon
                className={cn("h-5 w-5 flex-shrink-0", isActive && "text-sidebar-primary")}
              />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-sidebar-border border-t p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex w-full items-center justify-center rounded-lg px-3 py-2 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="mr-2 h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>

      <div className="border-sidebar-border border-t p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3 px-2 py-2">
            <Avatar src={session?.user?.image} alt={session?.user?.name || "User"} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sidebar-foreground truncate text-sm font-medium">
                {session?.user?.name || "User"}
              </p>
              <p className="text-sidebar-foreground/60 truncate text-xs">{session?.user?.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/signin" })}
              className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground flex w-full items-center justify-center rounded-lg px-3 py-2 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
