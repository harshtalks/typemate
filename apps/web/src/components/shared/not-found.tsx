import { useRouter } from "@tanstack/react-router";
import { Button } from "@typemate/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { WarningIcon } from "@typemate/ui/components/icons";

const NotFound = () => {
  const { navigate } = useRouter();
  return (
    <Empty className="my-40">
      <EmptyHeader>
        <EmptyMedia>
          <WarningIcon />
        </EmptyMedia>
        <EmptyTitle>404</EmptyTitle>
        <EmptyDescription>Page not found</EmptyDescription>
      </EmptyHeader>
      <EmptyDescription>
        <Button onClick={() => navigate({ to: "/" })}>Go back home</Button>
      </EmptyDescription>
    </Empty>
  );
};

export default NotFound;
