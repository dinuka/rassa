import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Admin",
  description: "Internal administration",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className="bg-background text-foreground">{children}</body>
  </html>
);

export default RootLayout;
