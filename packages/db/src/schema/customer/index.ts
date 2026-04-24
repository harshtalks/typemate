import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { organization } from "../organization";
import { createdAtSchema, updatedAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const customer = t.sqliteTable("customer", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.cust)
    .$type<Branded.CustomerId>(),
  organizationId: t
    .text("organization_id")
    .notNull()
    .$type<Branded.OrganizationId>()
    .references(() => organization.id),
  name: t.text("name").notNull(),
  email: t.text("email").notNull(),
  metadata: t
    .text("metadata", { mode: "json" })
    .$type<Record<string, unknown>>(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export const customerRelations = relations(customer, ({ one }) => ({
  organization: one(organization, {
    fields: [customer.organizationId],
    references: [organization.id],
  }),
}));

export type Customer = InferSelectModel<typeof customer>;
export type CustomerInsert = InferInsertModel<typeof customer>;
