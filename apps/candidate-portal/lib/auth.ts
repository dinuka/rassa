import NextAuth from "next-auth";

import { MongoDBAdapter } from "@auth/mongodb-adapter";

import { authConfig } from "./auth.config";
import { getClient } from "./mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(getClient()),
  events: {
    async createUser({ user }) {
      const client = await getClient();
      const db = client.db();
      await db
        .collection("users")
        .updateOne(
          { email: user.email },
          { $set: { onboardingComplete: false, createdAt: new Date() } },
        );
    },
  },
});

// Extend session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      provider?: string;
    };
  }

  interface JWT {
    id?: string;
    provider?: string;
    accessToken?: string;
  }
}
