import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@typemate/ui/components/avatar";
import { Badge } from "@typemate/ui/components/badge";
import { Button } from "@typemate/ui/components/button";
import { TrashIcon } from "@typemate/ui/components/icons";
import { formatDate, formatDistanceToNow } from "date-fns";
import type { FC } from "react";
import { getFallbackName } from "~/lib/helpers";
import type { MemberWithUser } from "~/rpcs/members/validator";

const MemberCard: FC<{ member: MemberWithUser }> = ({ member }) => {
  const handleDelete = () => {
    // TODO: implement delete functionality for the member
  };

  return (
    <div className="space-y-3 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarFallback>
              {getFallbackName(member.user?.name)}
            </AvatarFallback>
            <AvatarImage src={member.user?.image || undefined} />
          </Avatar>
          <h4 className="text-xl">{member.user?.name}</h4>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleDelete} variant="ghost">
            <TrashIcon className="text-red-500" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>{member.member.role}</Badge>
          <p className="text-muted-foreground">
            Joined{" "}
            {formatDistanceToNow(new Date(member.member.createdAt), {
              addSuffix: true,
            })}{" "}
            ({formatDate(new Date(member.member.createdAt), "MM/dd/yyyy")})
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
    </div>
  );
};

export default MemberCard;
