import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import LinkedIn from "next-auth/providers/linkedin";

export type PortalSource = "candidate" | "company" | "admin";

interface OAuthEnv {
  googleClientId: string;
  googleClientSecret: string;
  linkedinClientId: string;
  linkedinClientSecret: string;
}

// Token fields that travel from oauth-callback → JWT → Session.
// Portals extend User and JWT with their own DB fields via declare module augmentation.
export interface AuthUser {
  accessToken?: string;
  refreshToken?: string;
}

export const buildProviders = (env: OAuthEnv): Provider[] => [
  Google({
    clientId: env.googleClientId,
    clientSecret: env.googleClientSecret,
    authorization: {
      params: { prompt: "consent", access_type: "offline", response_type: "code" },
    },
  }),
  LinkedIn({
    clientId: env.linkedinClientId,
    clientSecret: env.linkedinClientSecret,
    authorization: { params: { scope: "openid profile email" } },
  }),
];

export const buildAuthConfig = (env: OAuthEnv): NextAuthConfig => ({
  providers: buildProviders(env),
  session: { strategy: "jwt" },
  pages: { signIn: "/signin", error: "/signin" },
  trustHost: true,
});

// Shared backend response shape — only the base fields all portals use.
export interface OAuthCallbackResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string };
}

export const buildCallbacks = (
  apiUrl: string,
  portalSource: PortalSource,
): NextAuthConfig["callbacks"] => ({
  async signIn({ user, account }) {
    if (!account) return false;

    const res = await fetch(`${apiUrl}/auth/oauth-callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        email: user.email,
        name: user.name,
        image: user.image,
        portalSource,
      }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as OAuthCallbackResponse;

    user.accessToken = data.accessToken;
    user.refreshToken = data.refreshToken;
    user.id = data.user.id;

    return true;
  },
  async jwt({ token, user }) {
    if (user?.accessToken) {
      token.accessToken = user.accessToken;
      token.refreshToken = user.refreshToken;
      token.sub = user.id;
    }

    return token;
  },
  async session({ session, token }) {
    session.user.id = token.sub!;
    session.accessToken = token.accessToken as string | undefined;
    session.refreshToken = token.refreshToken as string | undefined;

    return session;
  },
});

declare module "next-auth" {
  // User travels through signIn → jwt. Extends AuthUser so tokens live on the same object.
  // Portals augment this interface to add portal-specific DB fields (e.g. onboardingComplete).
  interface User extends AuthUser {
    // Override null → undefined to match component prop expectations
    name?: string;
    email?: string;
    image?: string;
  }

  // Session.user IS the augmented User type — no separate shape.
  // session.accessToken comes from AuthUser.
  interface Session extends AuthUser {
    user: User & { id: string };
  }

  // JWT extends AuthUser for the token fields.
  // Portals augment this to carry their own fields through the token (e.g. onboardingComplete).
  interface JWT extends AuthUser {}
}
