import { buildCallbacks, type OAuthCallbackResponse } from "@repo/auth";
import NextAuth from "next-auth";

import { authConfig } from "./auth.config";
import env from "./env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    ...buildCallbacks(env.apiUrl, "candidate"),
    async signIn({ user, account }) {
      if (!account) return false;

      const res = await fetch(`${env.apiUrl}/auth/oauth-callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          email: user.email,
          name: user.name,
          image: user.image,
          portalSource: "candidate",
        }),
      });

      if (!res.ok) return false;

      const data = await res.json() as OAuthCallbackResponse & { user: { onboardingComplete?: boolean } };
      user.accessToken = data.accessToken;
      user.refreshToken = data.refreshToken;
      user.id = data.user.id;
      user.onboardingComplete = data.user.onboardingComplete;

      return true;
    },
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.sub = user.id;
        token.onboardingComplete = user.onboardingComplete;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.accessToken = token.accessToken as string | undefined;
      session.user.onboardingComplete = token.onboardingComplete as boolean | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    onboardingComplete?: boolean;
  }

  interface JWT {
    onboardingComplete?: boolean;
  }
}
