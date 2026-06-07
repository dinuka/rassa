import NextAuth from "next-auth";

import { type OAuthCallbackResponse, buildCallbacks } from "@repo/auth";

import { authConfig } from "./auth.config";
import env from "./env";

const refreshAccessToken = async (refreshToken: string) => {
  const res = await fetch(`${env.apiUrl}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  return (await res.json()) as OAuthCallbackResponse;
};

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

      const data = (await res.json()) as OAuthCallbackResponse & {
        user: { onboardingComplete?: boolean };
      };
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
        // Store expiry 60s before actual expiry so we refresh proactively
        token.accessTokenExpiresAt = Date.now() + 14 * 60 * 1000;
      }

      if (Date.now() < (token.accessTokenExpiresAt as number)) {
        return token;
      }

      const refreshToken = token.refreshToken as string | undefined;
      if (!refreshToken) return token;

      const refreshed = await refreshAccessToken(refreshToken);
      if (!refreshed) return { ...token, accessToken: undefined, error: "RefreshAccessTokenError" };

      return {
        ...token,
        accessToken: refreshed.accessToken,
        refreshToken: refreshed.refreshToken,
        accessTokenExpiresAt: Date.now() + 14 * 60 * 1000,
        error: undefined,
      };
    },
    async session({ session, token }) {
      session.user.id = token.sub!;
      session.accessToken = token.accessToken as string | undefined;
      session.user.onboardingComplete = token.onboardingComplete as boolean | undefined;
      session.error = token.error as string | undefined;
      return session;
    },
  },
});

declare module "next-auth" {
  interface User {
    onboardingComplete?: boolean;
  }

  interface Session {
    error?: string;
  }

  interface JWT {
    onboardingComplete?: boolean;
    error?: string;
  }
}
