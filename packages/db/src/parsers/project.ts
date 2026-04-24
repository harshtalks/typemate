import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { project } from "../schema";

export const projectInsert = createInsertSchema(project, {
  id: z.string().transform(Branded.ProjectId).optional(),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const projectSelect = createSelectSchema(project, {
  id: z.string().transform(Branded.ProjectId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const projectSelectArray = z.array(projectSelect);
