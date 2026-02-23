import type { Branded } from "@typemate/types";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
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
  metadata: t.text("metadata", { mode: "json" }),
  createdAt: createdAtSchema,
});

export type Organization = InferSelectModel<typeof organization>;
export type OrganizationInsert = InferInsertModel<typeof organization>;
