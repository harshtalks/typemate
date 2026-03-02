import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import { accountSelectArray } from "@typemate/db/parsers/accounts";
import {
  organizationInsert,
  organizationSelectArray,
} from "@typemate/db/parsers/organizations";
import { sessionSelectArray } from "@typemate/db/parsers/sessions";

import { Branded } from "@typemate/types";
import z from "zod";
import { safeApiCall } from "~/lib/helpers";

// get current logged in user
const getUser = createServerFn({ method: "GET" }).handler(() =>
  auth.api.getSession({
    headers: getRequestHeaders(),
  })
);

// workspaces for current logged in users
const getSessionWorkspaces = createServerFn({ method: "GET" }).handler(() =>
  safeApiCall(organizationSelectArray)(() =>
    auth.api.listOrganizations({
      headers: getRequestHeaders(),
    })
  )
);

// create new workspace for current logged in user
const createSessionWorkspace = createServerFn({
  method: "POST",
})
  .inputValidator(organizationInsert)
  .handler(({ data }) =>
    auth.api.createOrganization({
      headers: getRequestHeaders(),
      body: {
        name: data.name,
        slug: data.slug,
        logo: data.logo ?? undefined,
        metadata: data.metadata ?? undefined,
        userId: data.id,
      },
    })
  );

const checkOrganizationSlug = createServerFn({ method: "POST" })
  .inputValidator(z.object({ slug: z.string().trim().min(1).max(50) }))
  .handler(({ data }) =>
    auth.api.checkOrganizationSlug({ body: data, headers: getRequestHeaders() })
  );

const deleteWorkspace = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ id: z.string().transform(Branded.OrganizationId) })
  )
  .handler(({ data }) => {
    return auth.api.deleteOrganization({
      body: {
        organizationId: data.id,
      },
      headers: getRequestHeaders(),
    });
  });

const getSessions = createServerFn({ method: "GET" }).handler(() =>
  safeApiCall(sessionSelectArray)(() =>
    auth.api.listSessions({
      headers: getRequestHeaders(),
    })
  )
);

const deleteSession = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      token: z.string(),
    })
  )
  .handler(({ data }) =>
    auth.api.revokeSession({
      body: {
        token: data.token,
      },
      headers: getRequestHeaders(),
    })
  );

const getUserAccounts = createServerFn({ method: "GET" }).handler(() =>
  safeApiCall(accountSelectArray)(() =>
    auth.api.listUserAccounts({ headers: getRequestHeaders() })
  )
);

const logout = createServerFn({ method: "POST" }).handler(() =>
  auth.api.signOut({
    headers: getRequestHeaders(),
  })
);

export const authRepo = {
  getUser,
  getSessionWorkspaces,
  createSessionWorkspace,
  checkOrganizationSlug,
  deleteWorkspace,
  getSessions,
  deleteSession,
  getUserAccounts,
  logout,
};
