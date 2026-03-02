import { useMutation } from "@tanstack/react-query";
import { useRouteContext, useRouter } from "@tanstack/react-router";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@typemate/ui/components/avatar";
import { Button } from "@typemate/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@typemate/ui/components/dropdown-menu";
import { getFallbackName } from "~/lib/helpers";
import { authRepo } from "~/rpcs/auth";

const AuthenticatedHeader = () => {
  const { user } = useRouteContext({ from: "/(authenticated)" });
  const { navigate, invalidate } = useRouter();
  const { queryClient } = useRouteContext({ from: "__root__" });

  const logOutMutation = useMutation({
    mutationFn: () => authRepo.logout(),
    onSuccess: () => {
      invalidate();
      queryClient.clear();
      window.location.reload();
    },
  });

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button className="size-8 rounded-full" variant={"ghost"}>
              <Avatar className={"size-8"}>
                <AvatarFallback>
                  {getFallbackName(user.user.name)}
                </AvatarFallback>
                <AvatarImage src={user.user.image ?? undefined} />
              </Avatar>
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              navigate({ to: "/profile" });
            }}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem onClick={() => logOutMutation.mutate()}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AuthenticatedHeader;
