import { projectInsert, projectSelect } from "@typemate/db/parsers/project";
import { Branded } from "@typemate/types";
import z from "zod";

export const projectByIdSchema = z.object({
  id: z.string().transform(Branded.ProjectId),
});

export const projectCreateSchema = projectInsert;

export const projectDeleteSchema = z.object({
  id: z.string().transform(Branded.ProjectId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export type ProjectByIdSchema = z.infer<typeof projectByIdSchema>;
export type ProjectCreateSchema = z.infer<typeof projectCreateSchema>;

export { projectSelect };
