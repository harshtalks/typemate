import { useMutation } from "@tanstack/react-query";
import { authClient } from "@typemate/auth/client";
import { Button } from "@typemate/ui/components/button";
import { GithubLogoIcon } from "@typemate/ui/components/icons";
import { toast } from "sonner";

const LoginWithGithub = () => {
  const mutation = useMutation({
    mutationFn: () =>
      authClient.signIn.social({
        provider: "github",
      }),
  });

  return (
    <Button
      disabled={mutation.isSuccess || mutation.isPending}
      onClick={() =>
        toast.promise(mutation.mutateAsync, {
          loading: "Taking you to Github....",
          success: "Redirecting to Github..",
          error: "Something went wrong",
        })
      }
    >
      Continue with Github <GithubLogoIcon />
    </Button>
  );
};
export default LoginWithGithub;
