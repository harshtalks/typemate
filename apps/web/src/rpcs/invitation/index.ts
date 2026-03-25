import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import {
  invitationSelect,
  invitationSelectArray,
} from "@typemate/db/parsers/invitation";
import { pipe } from "effect";
import { safeApiCall } from "~/lib/helpers";
import {
  castAsSanitizedLoadedSubsetOptions,
  parseLoadSubsetOptionsForAuth,
} from "~/queries/common";

const list = createServerFn({ method: "GET" })
  .inputValidator(castAsSanitizedLoadedSubsetOptions)
  .handler(({ data }) =>
    pipe(
      data,
      parseLoadSubsetOptionsForAuth,
      (x) => {
        console.log(x);
        return x;
      },
      (opts) =>
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

const add = createServerFn({ method: "POST" })
  .inputValidator(invitationSelect.omit({ status: true }))
  .handler(({ data }) =>
    auth.api.createInvitation({
      body: {
        email: data.email,
        role: data.role,
        organizationId: data.organizationId,
        resend: true,
      },
      headers: getRequestHeaders(),
    })
  );

export const invitationRepo = {
  list,
  add,
};
