import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { apiKey } from "../schema";

export const apiKeyInsert = createInsertSchema(apiKey, {
  id: z.string().transform(Branded.ApiKeyId).optional(),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const apiKeySelect = createSelectSchema(apiKey, {
  id: z.string().transform(Branded.ApiKeyId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const apiKeySelectArray = z.array(apiKeySelect);
