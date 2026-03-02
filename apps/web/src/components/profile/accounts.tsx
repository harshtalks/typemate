import { useLiveQuery } from "@tanstack/react-db";
import type { Account } from "@typemate/db/schema";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@typemate/ui/components/empty";
import { EmptyIcon } from "@typemate/ui/components/icons";
import { Array, pipe } from "effect";
import { accountsCollection } from "~/queries/accounts";
import { LiveQueryWrapper } from "../shared/live-query-wrapper";
import { NonEmptyArray } from "../utils/array";
import AccountCard from "./account-card";

const Accounts = () => {
  const liveQuery = useLiveQuery((query) =>
    query
      .from({ account: accountsCollection })
      .orderBy(({ account }) => account.createdAt, "desc")
  );

  return (
    <div className="space-y-8">
      <h4 className="font-semibold text-3xl">Accounts</h4>
      <LiveQueryWrapper query={liveQuery}>
        <LiveQueryWrapper.Error />
        <LiveQueryWrapper.Loading />
        <LiveQueryWrapper.Ready>
          {(accounts: Account[]) => (
            <NonEmptyArray data={accounts}>
              <NonEmptyArray.WhenEmpty>
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <EmptyIcon className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>No Sessions Found</EmptyTitle>
                    <EmptyDescription>
                      This seems to be a bug. Please report it to the
                      developers.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </NonEmptyArray.WhenEmpty>
              <NonEmptyArray.WhenNonEmpty>
                {(accounts) => (
                  <div className="space-y-8">
                    {pipe(
                      accounts,
                      Array.map((account: Account) => (
                        <AccountCard account={account} key={account.id} />
                      ))
                    )}
                  </div>
                )}
              </NonEmptyArray.WhenNonEmpty>
            </NonEmptyArray>
          )}
        </LiveQueryWrapper.Ready>
      </LiveQueryWrapper>
    </div>
  );
};

export default Accounts;
