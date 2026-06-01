const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const env = {
  googleClientId: requireEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
  linkedinClientId: requireEnv("LINKEDIN_CLIENT_ID"),
  linkedinClientSecret: requireEnv("LINKEDIN_CLIENT_SECRET"),
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
} as const;

export default env;
