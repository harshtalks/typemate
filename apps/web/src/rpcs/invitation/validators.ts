import { Branded } from "@typemate/types";
import z from "zod";

export const invitationIdSchema = z.object({
  invitationId: z.string().trim().transform(Branded.InvitationId),
});
