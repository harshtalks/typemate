import { Branded, INVOICE_STATUS } from "@typemate/types";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { invoice } from "../schema";

const invoiceStatusSchema = z.enum(
  Object.keys(INVOICE_STATUS) as [
    keyof typeof INVOICE_STATUS,
    ...Array<keyof typeof INVOICE_STATUS>,
  ]
);

export const invoiceInsert = createInsertSchema(invoice, {
  id: z.string().transform(Branded.InvoiceId).optional(),
  humanId: z.string().transform(Branded.InvoiceHumanId),
  projectId: z.string().transform(Branded.ProjectId),
  templateVersionId: z.string().transform(Branded.TemplateVersionId),
  customerId: z.string().transform(Branded.CustomerId),
  status: invoiceStatusSchema,
});

export const invoiceSelect = createSelectSchema(invoice, {
  id: z.string().transform(Branded.InvoiceId),
  humanId: z.string().transform(Branded.InvoiceHumanId),
  projectId: z.string().transform(Branded.ProjectId),
  templateVersionId: z.string().transform(Branded.TemplateVersionId),
  customerId: z.string().transform(Branded.CustomerId),
  status: invoiceStatusSchema,
});

export const invoiceSelectArray = z.array(invoiceSelect);
