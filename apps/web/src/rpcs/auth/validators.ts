import { Branded } from "@typemate/types";
import z from "zod";

export const orgSlugSchema = z.object({
  slug: z.string().trim().min(1).max(50),
});

export const workspaceIdSchema = z.object({
  id: z.string().transform(Branded.OrganizationId),
});

export const tokenSchema = z.object({
  token: z.string(),
});
