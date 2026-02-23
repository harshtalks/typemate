import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { member } from "../member";
import { organization } from "../organization";
import { createdAtSchema, createTimestampSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const invitation = t.sqliteTable("invitation", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.invitation)
    .$type<Branded.InvitationId>(),
  inviterId: t
    .text("inviter_id")
    .notNull()
    .references(() => member.id),
  organizationId: t.text("organization_id").references(() => organization.id),
  role: t.text("role").notNull(),
  status: t.text("status").notNull(),
  createdAt: createdAtSchema,
  expiresAt: createTimestampSchema("expires_at"),
});

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(member),
  organization: one(organization),
}));

export type Invitation = InferSelectModel<typeof invitation>;
export type InvitationInsert = InferInsertModel<typeof invitation>;
