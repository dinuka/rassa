"use client";

import { signOut } from "next-auth/react";

export const useLogout = () => {
  const logout = async () => {
    try {
      await fetch("/api/user/logout", { method: "POST" });
    } catch {
      // continue even if BFF call fails
    }
    await signOut({ callbackUrl: "/signin" });
  };
  return logout;
};
