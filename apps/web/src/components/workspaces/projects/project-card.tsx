import { Link } from "@tanstack/react-router";
import type { Project } from "@typemate/db/schema";
import { Badge } from "@typemate/ui/components/badge";
import { Button, buttonVariants } from "@typemate/ui/components/button";
import { ArrowRightIcon, TrashIcon } from "@typemate/ui/components/icons";
import { formatDate, formatDistanceToNow } from "date-fns";
import type { FC } from "react";
import { PermissionGate } from "~/components/shared/permission-gate";
import { projectsCollection } from "~/queries/projects";

const ProjectCard: FC<{ project: Project; workspaceId: string }> = ({
  project,
  workspaceId,
}) => {
  const onDelete = () => {
    projectsCollection.delete(project.id);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{project.name}</h4>
        <div className="flex items-center gap-2">
          <PermissionGate permission={{ project: ["delete"] }}>
            <Button onClick={onDelete} variant="ghost">
              <TrashIcon className="text-red-500" />
            </Button>
          </PermissionGate>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{project.slug}</Badge>
          <Badge variant="outline">{project.currency}</Badge>
          <Badge variant="outline">{project.invoicePrefix}</Badge>
          <p className="text-muted-foreground text-sm">
            {formatDistanceToNow(new Date(project.createdAt), {
              addSuffix: true,
            })}{" "}
            ({formatDate(new Date(project.createdAt), "MM/dd/yyyy")})
          </p>
        </div>
        <Button
          render={() => (
            <Link
              className={buttonVariants({ variant: "ghost" })}
              params={{ workspaceId, projectId: project.id }}
              to="/workspaces/$workspaceId/projects/$projectId"
            >
              Open <ArrowRightIcon />
            </Link>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectCard;
