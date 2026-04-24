import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { organization } from "../organization";
import { createdAtSchema, createTimestampSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const apiKey = t.sqliteTable("api_key", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.apiKey)
    .$type<Branded.ApiKeyId>(),
  organizationId: t
    .text("organization_id")
    .notNull()
    .$type<Branded.OrganizationId>()
    .references(() => organization.id),
  name: t.text("name").notNull(),
  keyHash: t.text("key_hash").notNull().unique(),
  keyPrefix: t.text("key_prefix").notNull(),
  createdAt: createdAtSchema,
  lastUsedAt: createTimestampSchema("last_used_at"),
  expiresAt: createTimestampSchema("expires_at"),
  revokedAt: createTimestampSchema("revoked_at"),
});

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
  organization: one(organization, {
    fields: [apiKey.organizationId],
    references: [organization.id],
  }),
}));

export type ApiKey = InferSelectModel<typeof apiKey>;
export type ApiKeyInsert = InferInsertModel<typeof apiKey>;
