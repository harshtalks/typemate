import { createServerOnlyFn } from "@tanstack/react-start";
import db from "@typemate/db";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { envs } from "../env";

export const getAuthConfig = createServerOnlyFn(() =>
  betterAuth({
    secret: envs.SERVER_BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, { provider: "sqlite" }),
    telemetry: {
      debug: true,
    },
    plugins: [tanstackStartCookies()],
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 minutes
      },
    },
  })
);

export const auth = getAuthConfig();
