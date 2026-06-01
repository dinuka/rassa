import { z } from "zod";

export enum UserRole {
  CANDIDATE = "candidate",
  COMPANY = "company",
  ADMIN = "admin",
}

export const OAuthCallbackPayloadSchema = z.object({
  provider: z.enum(["google", "linkedin"]),
  providerAccountId: z.string(),
  email: z.string().email(),
  name: z.string().optional(),
  image: z.string().url().optional(),
  portalSource: z.nativeEnum(UserRole),
});

export const TokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string().optional(),
    image: z.string().optional(),
    role: z.nativeEnum(UserRole),
    onboardingComplete: z.boolean(),
  }),
});

export type OAuthCallbackPayload = z.infer<typeof OAuthCallbackPayloadSchema>;
export type TokenResponse = z.infer<typeof TokenResponseSchema>;
