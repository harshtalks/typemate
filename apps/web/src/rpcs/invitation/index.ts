import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import { invitationSelectArray } from "@typemate/db/parsers/invitation";
import { pipe } from "effect";
import { safeApiCall } from "~/lib/helpers";
import {
  castAsSanitizedLoadedSubsetOptions,
  parseLoadSubsetOptionsForAuth,
} from "~/queries/common";

const list = createServerFn({ method: "GET" })
  .inputValidator(castAsSanitizedLoadedSubsetOptions)
  .handler(({ data }) =>
    pipe(data, parseLoadSubsetOptionsForAuth, (opts) =>
      safeApiCall(invitationSelectArray)(() =>
        auth.api.listInvitations({
          headers: getRequestHeaders(),
          query:
            opts.filterField === "organizationId"
              ? { organizationId: opts.filterValue }
              : {},
        })
      )
    )
  );

export const invitations = {
  list,
};
