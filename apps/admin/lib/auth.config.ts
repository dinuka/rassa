import { buildAuthConfig } from "@repo/auth";

import env from "./env";

export const authConfig = buildAuthConfig(env);
