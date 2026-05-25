"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";

import { Bell, Menu, Search } from "lucide-react";

import { Avatar, Button, Input } from "@repo/ui";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 h-16 border-b backdrop-blur">
      <div className="flex h-full items-center gap-4 px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="max-w-md flex-1">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              placeholder="Search jobs, applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted/50 focus-visible:bg-background focus-visible:border-input border-transparent pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="bg-primary absolute top-1.5 right-1.5 h-2 w-2 rounded-full" />
            <span className="sr-only">Notifications</span>
          </Button>

          <div className="md:hidden">
            <Avatar src={session?.user?.image} alt={session?.user?.name || "User"} size="sm" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
