import { createFileRoute } from "@tanstack/react-router";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { SignInIcon } from "@typemate/ui/components/icons";
import LoginWithGithub from "~/components/auth/login-with-github";
import SendMagicLink from "~/components/auth/magic-link";

export const Route = createFileRoute("/sign-in/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Empty className="py-40">
      <EmptyHeader>
        <EmptyMedia variant={"icon"}>
          <SignInIcon />
        </EmptyMedia>
        <EmptyTitle>Sign In</EmptyTitle>
        <EmptyDescription>
          Sign in to your account to continue.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex flex-wrap items-center gap-2">
        <LoginWithGithub />
        <SendMagicLink />
      </EmptyContent>
    </Empty>
  );
}
