import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Loads ../../.env for local dev; no-op on Vercel since override: false won't overwrite injected vars
config({ path: resolve(__dirname, "../../.env"), override: false });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/ai-sdk", "@repo/auth", "@repo/api-client"],
};

export default nextConfig;
