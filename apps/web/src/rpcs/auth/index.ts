import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import {
  organizationInsert,
  organizationSelectArray,
} from "@typemate/db/parsers";
import { safeApiCall } from "~/lib/helpers";

// get current logged in user
const getUser = createServerFn({ method: "GET" }).handler(() =>
  auth.api.getSession({
    headers: getRequestHeaders(),
  })
);

// workspaces for current logged in users
const getSessionWorkspaces = createServerFn({ method: "GET" }).handler(() =>
  safeApiCall(organizationSelectArray)(() => auth.api.listOrganizations())
);

// create new workspace for current logged in user
const createSessionWorkspace = createServerFn({
  method: "POST",
})
  .inputValidator(organizationInsert)
  .handler(({ data }) =>
    auth.api.createOrganization({
      headers: getRequestHeaders(),
      body: data,
    })
  );

export const authRepo = {
  getUser,
  getSessionWorkspaces,
  createSessionWorkspace,
};
