import { envs } from "@typemate/db/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema/index.ts",
  dialect: "turso",
  dbCredentials: {
    url: envs.SERVER_DATABASE_URL,
    authToken: envs.SERVER_AUTH_TOKEN,
  },
});
