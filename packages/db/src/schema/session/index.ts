import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { createdAtSchema, updatedAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { user } from "../user";

export const session = t.sqliteTable("session", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.session)
    .$type<Branded.SessionId>(),
  token: t.text("token").notNull(),
  ipAddress: t.text("ip_address"),
  userAgent: t.text("user_agent"),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  // foreign key - user
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    })
    .$type<Branded.UserId>(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user),
}));

export type Session = InferSelectModel<typeof session>;
export type SessionInsert = InferInsertModel<typeof session>;
