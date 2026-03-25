import { useRouteContext } from "@tanstack/react-router";
import { Badge } from "@typemate/ui/components/badge";
import { DATE_FORMAT } from "@typemate/ui/lib/utils";
import { formatDate, formatDistanceToNow } from "date-fns";
import { Array, pipe } from "effect";
import pluralize from "pluralize-esm";

const Overview = () => {
  const { workspace, workspaceMember } = useRouteContext({
    from: "/(authenticated)/workspaces/$workspaceId/",
  });

  if (!workspace) {
    return null;
  }

  const owners = pipe(
    workspace.members,
    Array.filter((x) => x.role === "owner")
  );

  const admins = pipe(
    workspace.members,
    Array.filter((x) => x.role === "admin")
  );

  const devs = pipe(
    workspace.members,
    Array.filter((x) => x.role === "developer")
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Slug</p>
        <Badge>{workspace.slug}</Badge>
      </div>

      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Created At</p>
        <p className="text-sm">
          {formatDistanceToNow(new Date(workspace.createdAt), {
            addSuffix: true,
          })}{" "}
          <span className="text-muted-foreground">
            ({formatDate(new Date(workspace.createdAt), DATE_FORMAT)})
          </span>
        </p>
      </div>

      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">Members</p>
        <p className="text-sm">
          {workspace.members.length}{" "}
          <span className="text-muted-foreground">
            ({pluralize("owner", owners.length, true)},{" "}
            {pluralize("admin", admins.length, true)},{" "}
            {pluralize("developer", devs.length, true)})
          </span>
        </p>
      </div>

      {workspaceMember ? (
        <div className="space-y-1">
          <p className="text-muted-foreground text-sm">Owner</p>
          <Badge>{workspaceMember.id}</Badge>
        </div>
      ) : null}
    </div>
  );
};

export default Overview;
