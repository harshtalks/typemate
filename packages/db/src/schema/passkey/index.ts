import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { createdAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { user } from "../user";

export const passkey = t.sqliteTable("passkey", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.passkey)
    .$type<Branded.PasskeyId>(),
  name: t.text("name"),
  publicKey: t.text("public_key").notNull(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  credentialId: t.text("credential_id").notNull().$type<Branded.CredentialId>(),
  counter: t.int("counter").notNull(),
  deviceType: t.text("device_type").notNull(),
  backedUp: t
    .int("backed_up", {
      mode: "boolean",
    })
    .notNull(),
  transports: t.text("transports"),
  createdAt: createdAtSchema,
  aaguid: t.text("aaguid"),
});

export const passkeyRelations = relations(passkey, ({ one }) => ({
  user: one(user),
}));

export type Passkey = InferSelectModel<typeof passkey>;
export type PasskeyInsert = InferInsertModel<typeof passkey>;
