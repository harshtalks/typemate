import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envs = createEnv({
  server: {
    SERVER_BETTER_AUTH_SECRET: z.string().min(1),
    SERVER_GITHUB_CLIENT_ID: z.string().min(1),
    SERVER_GITHUB_CLIENT_SECRET: z.string().min(1),
    SERVER_BETTER_AUTH_BASE_URL: z.string().min(1),
    SERVER_RESEND_API_KEY: z.string().min(1),
  },
  runtimeEnv: process.env,
});
