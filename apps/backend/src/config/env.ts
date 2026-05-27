import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../../../../.env"), override: false });

type JwtDuration = `${number}${"s" | "m" | "h" | "d" | "w" | "y"}`;

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
};

const env = {
  mongodbUri: requireEnv("MONGODB_URI"),
  redisHost: process.env.REDIS_HOST ?? "localhost",
  redisPort: Number(process.env.REDIS_PORT ?? "6379"),
  corsOrigin: process.env.CORS_ORIGIN?.split(",") ?? ["*"],
  port: Number(process.env.PORT ?? "4000"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiration: (process.env.JWT_EXPIRATION ?? "15m") as JwtDuration,
  jwtRefreshExpiration: (process.env.JWT_REFRESH_EXPIRATION ?? "7d") as JwtDuration,
  aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://localhost:8000",
  minioEndpoint: process.env.MINIO_ENDPOINT ?? "localhost",
  minioPort: Number(process.env.MINIO_PORT ?? "9000"),
  minioAccessKey: process.env.MINIO_ACCESS_KEY ?? "minioadmin",
  minioSecretKey: process.env.MINIO_SECRET_KEY ?? "minioadmin",
  minioBucket: process.env.MINIO_BUCKET ?? "rassa-files",
  qdrantHost: process.env.QDRANT_HOST ?? "localhost",
  qdrantPort: Number(process.env.QDRANT_PORT ?? "6333"),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
} as const;

export default env;
