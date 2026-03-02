import { Branded } from "@typemate/types";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";
import { session } from "../schema";

export const sessionInsert = createInsertSchema(session, {
  id: z.string().transform(Branded.SessionId).optional(),
  userId: z.string().transform(Branded.UserId),
});

export const sessionSelect = createInsertSchema(session, {
  id: z.string().transform(Branded.SessionId),
  userId: z.string().transform(Branded.UserId),
});

export const sessionSelectArray = z.array(sessionSelect);
