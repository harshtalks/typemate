import { memberSelectArray } from "@typemate/db/parsers/members";
import { organizationSelect } from "@typemate/db/parsers/organizations";

export const workspaceByIdSchema = organizationSelect.pick({ id: true });

export const workspaceByIdResponse = organizationSelect.extend({
  members: memberSelectArray,
});
