import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";
import { APIError } from "@typemate/auth/errors";
import type { Permissions } from "@typemate/auth/permissions";
import type { Branded } from "@typemate/types";

export type { Permissions };

export async function requirePermission(
  permissions: Permissions,
  organizationId: Branded.OrganizationId
): Promise<void> {
  const result = await auth.api.hasPermission({
    headers: getRequestHeaders(),
    body: { permissions, organizationId },
  });

  if (!result?.success) {
    throw new APIError("FORBIDDEN", {
      message: "You do not have permission to perform this action",
      code: "PERMISSION_DENIED",
    });
  }
}
