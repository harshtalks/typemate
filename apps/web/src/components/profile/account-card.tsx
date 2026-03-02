import type { Account } from "@typemate/db/schema";
import { Button } from "@typemate/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@typemate/ui/components/collapsible";

import { CaretDownIcon } from "@typemate/ui/components/icons";
import { format } from "date-fns";

const AccountCard = ({ account }: { account: Account }) => {
  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h5 className="truncate font-semibold text-xl">
            Account {account.id}
          </h5>
        </div>
        <div className="flex items-center">
          {/*<Button } size="sm" variant="ghost">
            <TrashIcon className="h-4 w-4 text-red-500" />
          </Button>*/}
          <CollapsibleTrigger
            render={
              <Button className={"group"} size="sm" variant="ghost">
                <CaretDownIcon className="h-4 w-4 transition-all group-data-panel-open:rotate-180" />
              </Button>
            }
          />
        </div>
      </div>
      <CollapsibleContent className="space-y-4 p-4">
        <CollapsibleContent className="space-y-4 p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            This account (ID: <strong>{account.accountId}</strong>) belongs to
            user <strong>{account.userId}</strong> and is linked with provider{" "}
            <strong>{account.providerId}</strong>. It was created on{" "}
            {format(new Date(account.createdAt), "MMM dd, yyyy 'at' h:mm a")}
            {account.updatedAt
              ? ` and last updated on ${format(
                  new Date(account.updatedAt),
                  "MMM dd, yyyy 'at' h:mm a"
                )}.`
              : "."}{" "}
            {account.accessToken
              ? "An access token is currently active."
              : "No active access token is available."}{" "}
            {account.idToken
              ? "An ID token is present."
              : "No ID token is currently linked."}{" "}
            {account.scope
              ? `The granted scope includes: <code>${account.scope}</code>.`
              : "No scopes have been specified for this account."}
          </p>
        </CollapsibleContent>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default AccountCard;
