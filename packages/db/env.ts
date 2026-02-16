import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envs = createEnv({
  server: {
    SERVER_DATABASE_URL: z.string().min(1),
    SERVER_AUTH_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
});
