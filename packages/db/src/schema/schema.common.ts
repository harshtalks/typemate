import * as t from "drizzle-orm/sqlite-core";

export const createTimestampSchema = <T extends string>(key: T) =>
  t.integer(key, {
    mode: "timestamp",
  });

export const createdAtSchema = createTimestampSchema("created_at").notNull();

export const updatedAtSchema = createTimestampSchema("updated_at");
