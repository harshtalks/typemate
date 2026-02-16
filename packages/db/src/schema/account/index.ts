import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { updatedAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { user } from "../user";

export const account = t.sqliteTable("account", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.account)
    .$type<Branded.AccountId>(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .$type<Branded.UserId>(),
  accountId: t.text("account_id").notNull(),
  providerId: t.text("provider_id").notNull().$type<Branded.ProviderId>(),
  accessToken: t.text("access_token"),
  scope: t.text("scope"),
  idToken: t.text("id_token"),
  createdAt: t.int({ mode: "timestamp" }).notNull(),
  updatedAt: updatedAtSchema,
});

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user),
}));

export type Account = InferSelectModel<typeof account>;
export type AccountInsert = InferInsertModel<typeof account>;
