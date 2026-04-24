import type {
  Branded,
  TemplateVariableSchema,
  TemplateVersionStatus,
} from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { createdAtSchema, createTimestampSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";
import { template } from "../template";

export const templateVersion = t.sqliteTable(
  "template_version",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(PrefixedIDs.tmplv)
      .$type<Branded.TemplateVersionId>(),
    templateId: t
      .text("template_id")
      .notNull()
      .$type<Branded.TemplateId>()
      .references(() => template.id),
    version: t.text("version").notNull(),
    status: t.text("status").notNull().$type<TemplateVersionStatus>(),
    content: t.text("content").notNull(),
    schema: t
      .text("schema", { mode: "json" })
      .notNull()
      .$type<TemplateVariableSchema>(),
    createdAt: createdAtSchema,
    publishedAt: createTimestampSchema("published_at"),
  },
  (table) => [
    t
      .uniqueIndex("template_version_unique")
      .on(table.templateId, table.version),
  ]
);

export const templateVersionRelations = relations(
  templateVersion,
  ({ one }) => ({
    template: one(template, {
      fields: [templateVersion.templateId],
      references: [template.id],
    }),
  })
);

export type TemplateVersion = InferSelectModel<typeof templateVersion>;
export type TemplateVersionInsert = InferInsertModel<typeof templateVersion>;
