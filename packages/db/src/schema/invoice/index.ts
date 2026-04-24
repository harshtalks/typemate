import type { Branded, InvoiceStatus } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { customer } from "../customer";
import { project } from "../project";
import {
  createdAtSchema,
  createTimestampSchema,
  updatedAtSchema,
} from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { templateVersion } from "../template-version";

export const invoice = t.sqliteTable("invoice", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.inv)
    .$type<Branded.InvoiceId>(),
  humanId: t
    .text("human_id")
    .notNull()
    .unique()
    .$type<Branded.InvoiceHumanId>(),
  projectId: t
    .text("project_id")
    .notNull()
    .$type<Branded.ProjectId>()
    .references(() => project.id),
  templateVersionId: t
    .text("template_version_id")
    .notNull()
    .$type<Branded.TemplateVersionId>()
    .references(() => templateVersion.id),
  customerId: t
    .text("customer_id")
    .notNull()
    .$type<Branded.CustomerId>()
    .references(() => customer.id),
  status: t.text("status").notNull().$type<InvoiceStatus>(),
  data: t
    .text("data", { mode: "json" })
    .notNull()
    .$type<Record<string, unknown>>(),
  snapshot: t.text("snapshot").notNull(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  sentAt: createTimestampSchema("sent_at"),
  paidAt: createTimestampSchema("paid_at"),
  voidedAt: createTimestampSchema("voided_at"),
  dueAt: createTimestampSchema("due_at"),
});

export const invoiceRelations = relations(invoice, ({ one }) => ({
  project: one(project, {
    fields: [invoice.projectId],
    references: [project.id],
  }),
  templateVersion: one(templateVersion, {
    fields: [invoice.templateVersionId],
    references: [templateVersion.id],
  }),
  customer: one(customer, {
    fields: [invoice.customerId],
    references: [customer.id],
  }),
}));

export type Invoice = InferSelectModel<typeof invoice>;
export type InvoiceInsert = InferInsertModel<typeof invoice>;
