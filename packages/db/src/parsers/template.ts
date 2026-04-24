import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { template } from "../schema";

export const templateInsert = createInsertSchema(template, {
  id: z.string().transform(Branded.TemplateId).optional(),
  projectId: z.string().transform(Branded.ProjectId),
});

export const templateSelect = createSelectSchema(template, {
  id: z.string().transform(Branded.TemplateId),
  projectId: z.string().transform(Branded.ProjectId),
});

export const templateSelectArray = z.array(templateSelect);
