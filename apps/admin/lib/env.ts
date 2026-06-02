const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  googleClientId: requireEnv("GOOGLE_CLIENT_ID"),
  googleClientSecret: requireEnv("GOOGLE_CLIENT_SECRET"),
  linkedinClientId: requireEnv("LINKEDIN_CLIENT_ID"),
  linkedinClientSecret: requireEnv("LINKEDIN_CLIENT_SECRET"),
  nextAuthUrl: requireEnv("AUTH_URL"),
  nextAuthSecret: requireEnv("NEXTAUTH_SECRET"),
} as const;

export default env;
