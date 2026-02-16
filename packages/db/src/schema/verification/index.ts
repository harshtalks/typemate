import type { Branded } from "@typemate/types";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import {
  createdAtSchema,
  createTimestampSchema,
  updatedAtSchema,
} from "../schema.common";
import { PrefixedIDs } from "../schema.helper";

export const verification = t.sqliteTable("verification", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(PrefixedIDs.verification)
    .$type<Branded.VerificationId>(),
  identifier: t.text("identifier").notNull(),
  value: t.text("value").notNull(),
  expiresAt: createTimestampSchema("expires_at"),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
});

export type Verification = InferSelectModel<typeof verification>;
export type VerificationInsert = InferInsertModel<typeof verification>;
