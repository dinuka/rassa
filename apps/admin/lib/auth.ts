import NextAuth from "next-auth";

import { buildCallbacks } from "@repo/auth";

import { authConfig } from "./auth.config";
import env from "./env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: buildCallbacks(env.apiUrl, "admin"),
});
