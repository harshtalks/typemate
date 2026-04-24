import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { templateVersion } from "../schema";

export const templateVersionInsert = createInsertSchema(templateVersion, {
  id: z.string().transform(Branded.TemplateVersionId).optional(),
  templateId: z.string().transform(Branded.TemplateId),
});

export const templateVersionSelect = createSelectSchema(templateVersion, {
  id: z.string().transform(Branded.TemplateVersionId),
  templateId: z.string().transform(Branded.TemplateId),
});

export const templateVersionSelectArray = z.array(templateVersionSelect);
