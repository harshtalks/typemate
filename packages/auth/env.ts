import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const envs = createEnv({
  server: {
    SERVER_BETTER_AUTH_SECRET: z.string().min(1),
  },
  runtimeEnv: process.env,
});
