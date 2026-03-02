import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@typemate/ui/components/avatar";
import { Badge } from "@typemate/ui/components/badge";
import Accounts from "~/components/profile/accounts";
import Sessions from "~/components/profile/sessions";
import { getFallbackName } from "~/lib/helpers";

export const Route = createFileRoute("/(authenticated)/profile")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useRouteContext({ from: "/(authenticated)" });

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <Avatar className={"size-30"}>
          <AvatarFallback>{getFallbackName(user.user.name)}</AvatarFallback>
          <AvatarImage src={user.user.image ?? undefined} />
        </Avatar>
        <div className="space-y-2">
          <h1 className="font-semibold text-4xl">{user.user.name}</h1>
          <p className="text-muted-foreground text-sm">{user.user.email}</p>
          <p className="text-muted-foreground text-sm">
            Joined on {new Date(user.user.createdAt).toLocaleDateString()}
          </p>
          <Badge variant={"secondary"}>{user.user.id}</Badge>
        </div>
      </div>
      <Sessions />
      <Accounts />
    </div>
  );
}
