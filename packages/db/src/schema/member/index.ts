import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { organization } from "../organization";
import { createdAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { user } from "../user";

export const member = t.sqliteTable("member", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.member)
    .$type<Branded.MemberId>(),
  userId: t
    .text("user_id")
    .notNull()
    .references(() => user.id),
  organizationId: t
    .text("organization_id")
    .notNull()
    .references(() => organization.id),
  role: t.text("role").notNull(),
  createdAt: createdAtSchema,
});

export const memberRelations = relations(member, ({ one }) => ({
  user: one(member),
  organization: one(organization),
}));

export type Member = InferSelectModel<typeof member>;
export type MemberInsert = InferInsertModel<typeof member>;
