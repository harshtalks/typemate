import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@typemate/ui/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { WarningIcon } from "@typemate/ui/components/icons";

const ErrorComponent = ({ error, reset }: ErrorComponentProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <WarningIcon />
        </EmptyMedia>
        <EmptyTitle>Something went wrong</EmptyTitle>
        <EmptyDescription>{error.message}</EmptyDescription>
      </EmptyHeader>
      <EmptyDescription>
        <Button onClick={reset}>Reset</Button>
      </EmptyDescription>
    </Empty>
  );
};

export default ErrorComponent;
