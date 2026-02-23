import { envs } from "@typemate/db/env";
import * as schema from "@typemate/db/schema";
import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/libsql";

dotenv.config();

// You can specify any property from the libsql connection options
const db = drizzle({
  connection: {
    url: envs.SERVER_DATABASE_URL,
    authToken: envs.SERVER_AUTH_TOKEN,
  },
  schema,
  logger: true,
});

export default db;
