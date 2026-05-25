const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
} as const;

export default env;
