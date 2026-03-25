import type { Invitation } from "@typemate/db/schema";
import { Badge } from "@typemate/ui/components/badge";
import { Button } from "@typemate/ui/components/button";
import { TrashIcon } from "@typemate/ui/components/icons";
import { DATE_FORMAT } from "@typemate/ui/lib/utils";
import { formatDate, formatDistanceToNow } from "date-fns";
import type { FC } from "react";

const InvitationCard: FC<{ invitation: Invitation }> = ({ invitation }) => {
  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xl">{invitation.email}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost">
            <TrashIcon className="text-red-500" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>{invitation.role}</Badge>
          <p className="text-muted-foreground">
            Invited{" "}
            {formatDistanceToNow(new Date(invitation.createdAt), {
              addSuffix: true,
            })}{" "}
            ({formatDate(new Date(invitation.createdAt), DATE_FORMAT)})
          </p>
        </div>

        {/*<Button
          render={() => (
            <Link className={buttonVariants({ variant: "ghost" })}>
              View Profile <ArrowRightIcon />
            </Link>
          )}
        />*/}
      </div>
      <p className="text-muted-foreground">
        Invitation Expires in{" "}
        {formatDistanceToNow(new Date(invitation.expiresAt))} (
        {formatDate(new Date(invitation.expiresAt), DATE_FORMAT)})
      </p>
    </div>
  );
};

export default InvitationCard;
