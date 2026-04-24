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

export const project = t.sqliteTable(
  "project",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(PrefixedIDs.proj)
      .$type<Branded.ProjectId>(),
    organizationId: t
      .text("organization_id")
      .notNull()
      .$type<Branded.OrganizationId>()
      .references(() => organization.id),
    name: t.text("name").notNull(),
    slug: t.text("slug").notNull(),
    timezone: t.text("timezone").notNull().default("UTC"),
    invoicePrefix: t.text("invoice_prefix").notNull(),
    currency: t.text("currency").notNull().default("USD"),
    invoiceSequence: t.integer("invoice_sequence").notNull().default(0),
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
  },
  (table) => [
    t
      .uniqueIndex("project_org_slug_unique")
      .on(table.organizationId, table.slug),
  ]
);

export const projectRelations = relations(project, ({ one }) => ({
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
}));

export type Project = InferSelectModel<typeof project>;
export type ProjectInsert = InferInsertModel<typeof project>;
