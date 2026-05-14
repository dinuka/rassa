/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "@repo/ai-sdk", "@repo/auth", "@repo/api-client"],
};

export default nextConfig;
