const clientEnv = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
  cvParseMaxAttempts: Number(process.env.NEXT_PUBLIC_CV_PARSE_MAX_ATTEMPTS ?? "10"),
  cvParseIntervalMs: Number(process.env.NEXT_PUBLIC_CV_PARSE_INTERVAL_MS ?? "10000"),
} as const;

export default clientEnv;
