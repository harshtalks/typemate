import { Branded } from "@typemate/types";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { organization } from "../schema";

export const brandedSchemaGenerator = <T extends string>(
  brandGenerator: Branded.BrandedIdConvertor<T>
) => z.string().transform(brandGenerator);

export const organizationInsert = createInsertSchema(organization, {
  id: brandedSchemaGenerator(Branded.OrganizationId).optional(),
  logo: z.string().optional(),
  metadata: z.object().optional(),
});

export const organizationSelect = createInsertSchema(organization, {
  id: brandedSchemaGenerator(Branded.OrganizationId),
});

export const organizationSelectArray = z.array(organizationSelect);
