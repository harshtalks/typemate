import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { account } from "../account";
import { createdAtSchema, updatedAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { session } from "../session";

export const user = t.sqliteTable("user", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.user)
    .$type<Branded.UserId>(),
  name: t.text("name").notNull(),
  email: t.text("email").notNull().unique(),
  emailVerified: t
    .integer("email_verified", {
      mode: "boolean",
    })
    .notNull()
    .default(false),
  image: t.text("image"),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export type User = InferSelectModel<typeof user>;
export type UserInsert = InferInsertModel<typeof user>;
