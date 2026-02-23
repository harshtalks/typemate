import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import {
  organizationInsert,
  organizationSelectArray,
} from "@typemate/db/parsers/organizations";
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

export const authRepo = {
  getUser,
  getSessionWorkspaces,
  createSessionWorkspace,
  checkOrganizationSlug,
  deleteWorkspace,
};
