import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { member } from "../member";
import { createdAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const organization = t.sqliteTable("organization", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.org)
    .$type<Branded.OrganizationId>(),
  name: t.text("name").notNull(),
  slug: t.text("slug").notNull().unique(),
  logo: t.text("logo"),
  createdAt: createdAtSchema,
});

export const organizationRelations = relations(organization, ({ many }) => ({
  members: many(member, {
    relationName: "organizationMembers",
  }),
}));

export type Organization = InferSelectModel<typeof organization>;
export type OrganizationInsert = InferInsertModel<typeof organization>;
