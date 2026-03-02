import { Branded } from "@typemate/types";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { account } from "../schema";

export const accountInsert = createInsertSchema(account, {
  id: z.string().transform(Branded.AccountId).optional(),
  providerId: z.string().transform(Branded.ProviderId),
  userId: z.string().transform(Branded.UserId),
});

export const accountSelect = createInsertSchema(account, {
  id: z.string().transform(Branded.AccountId),
  providerId: z.string().transform(Branded.ProviderId),
  userId: z.string().transform(Branded.UserId),
});

export const accountSelectArray = z.array(accountSelect);
