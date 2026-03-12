import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { user } from "../schema";

export const userInsert = createInsertSchema(user, {
  id: z.string().transform(Branded.UserId).optional(),
});

export const userSelect = createSelectSchema(user, {
  id: z.string().transform(Branded.UserId),
});
