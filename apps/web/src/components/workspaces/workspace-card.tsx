import { Link } from "@tanstack/react-router";
import type { Organization } from "@typemate/db/schema";
import { Badge } from "@typemate/ui/components/badge";
import { Button, buttonVariants } from "@typemate/ui/components/button";
import { ArrowRightIcon, TrashIcon } from "@typemate/ui/components/icons";
import { workspacesCollection } from "~/queries/workspaces";

const WorkspaceCard = ({ workspace }: { workspace: Organization }) => {
  const onDelete = () => {
    workspacesCollection.delete(workspace.id);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4>{workspace.name}</h4>
        <div className="flex items-center gap-2">
          <Button onClick={onDelete} variant={"ghost"}>
            <TrashIcon className="text-red-500" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>{workspace.slug}</Badge>
          <p className="text-sm">
            Created on {workspace.createdAt.toLocaleString()}
          </p>
        </div>
        <Button
          render={() => (
            <Link
              className={buttonVariants({
                variant: "ghost",
              })}
              to="/create-new-workspace"
            >
              Take me there <ArrowRightIcon />
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default WorkspaceCard;
