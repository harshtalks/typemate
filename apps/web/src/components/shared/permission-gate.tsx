import { useRouteContext } from "@tanstack/react-router";
import { authClient } from "@typemate/auth/client";
import type { Permissions } from "@typemate/auth/permissions";
import type { ReactNode } from "react";

interface PermissionGateProps {
  permission: Permissions;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { workspaceMember } = useRouteContext({
    from: "/(authenticated)/workspaces/$workspaceId",
  });

  const role = workspaceMember?.role;

  if (
    !(role && authClient.organization.checkRolePermission({ permission, role }))
  ) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
