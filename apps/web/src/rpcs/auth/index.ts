import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";

export const getUser = createServerFn({ method: "GET" }).handler(() =>
  auth.api.getSession({
    headers: getRequestHeaders(),
  })
);

// workspaces for current logged in users

export const getSessionWorkspaces = createServerFn({ method: "GET" }).handler(
  () => auth.api.listOrganizations({ headers: getRequestHeaders() })
);
