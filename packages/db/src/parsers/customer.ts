import { Branded } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { customer } from "../schema";

export const customerInsert = createInsertSchema(customer, {
  id: z.string().transform(Branded.CustomerId).optional(),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const customerSelect = createSelectSchema(customer, {
  id: z.string().transform(Branded.CustomerId),
  organizationId: z.string().transform(Branded.OrganizationId),
});

export const customerSelectArray = z.array(customerSelect);
