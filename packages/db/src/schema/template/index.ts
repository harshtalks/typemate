import type { Branded } from "@typemate/types";
import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { project } from "../project";
import { createdAtSchema, updatedAtSchema } from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const template = t.sqliteTable(
  "template",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(PrefixedIDs.tmpl)
      .$type<Branded.TemplateId>(),
    projectId: t
      .text("project_id")
      .notNull()
      .$type<Branded.ProjectId>()
      .references(() => project.id),
    name: t.text("name").notNull(),
    slug: t.text("slug").notNull(),
    createdAt: createdAtSchema,
    updatedAt: updatedAtSchema,
  },
  (table) => [
    t
      .uniqueIndex("template_project_slug_unique")
      .on(table.projectId, table.slug),
  ]
);

export const templateRelations = relations(template, ({ one }) => ({
  project: one(project, {
    fields: [template.projectId],
    references: [project.id],
  }),
}));

export type Template = InferSelectModel<typeof template>;
export type TemplateInsert = InferInsertModel<typeof template>;
