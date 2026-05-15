import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { getClient } from "./mongodb";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getClient()),
  events: {
    async createUser({ user }) {
      const client = await getClient();
      const db = client.db();
      await db.collection("users").updateOne(
        { email: user.email },
        { $set: { onboardingComplete: false, createdAt: new Date() } }
      );
    },
  },
});

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    provider?: string;
    accessToken?: string;
  }
}
