import { useRouteContext } from "@tanstack/react-router";
import type { Session } from "@typemate/db/schema";
import { Badge } from "@typemate/ui/components/badge";
import { Button } from "@typemate/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@typemate/ui/components/collapsible";

import { CaretDownIcon, TrashIcon } from "@typemate/ui/components/icons";
import { format, formatDistanceToNow, isToday } from "date-fns";
import type { IResult } from "ua-parser-js";
import { UAParser } from "ua-parser-js";
import { sessionsCollection } from "~/queries/sessions";

const SessionCard = ({ session }: { session: Session }) => {
  const {
    user: { session: activeSession },
  } = useRouteContext({ from: "/(authenticated)" });
  const parser = new UAParser(session.userAgent ?? undefined);
  const uaData: IResult = parser.getResult();

  const device = uaData.device.model || uaData.device.type || "Device";
  const browser = `${uaData.browser.name} ${uaData.browser.version}`;
  const os = `${uaData.os.name} ${uaData.os.version}`;
  const cpu = uaData.cpu.architecture
    ? ` (${uaData.cpu.architecture} architecture)`
    : "";
  const uaSummary = `${device} using ${browser} on ${os}${cpu}`;

  const createdDate = new Date(session.createdAt);
  const lastUsedDate = session.updatedAt ? new Date(session.updatedAt) : null;

  const removeSession = () => {
    sessionsCollection.delete(session.id);
  };

  return (
    <Collapsible>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h5 className="truncate font-semibold text-xl">
            Session {session.id}
          </h5>
          {session.id === activeSession.id && (
            <Badge variant={"secondary"}>Current</Badge>
          )}
        </div>
        <div className="flex items-center">
          {session.id !== activeSession.id && (
            <Button onClick={removeSession} size="sm" variant="ghost">
              <TrashIcon className="h-4 w-4 text-red-500" />
            </Button>
          )}
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
        <p className="text-muted-foreground text-sm leading-relaxed">
          This session was created on{" "}
          <b>
            {isToday(new Date(createdDate))
              ? format(new Date(createdDate), "'Today at' h:mm a")
              : format(new Date(createdDate), "MMM dd, yyyy 'at' h:mm a")}
          </b>{" "}
          {lastUsedDate ? (
            <>
              and was last accessed{" "}
              <b>
                {isToday(new Date(lastUsedDate))
                  ? format(new Date(lastUsedDate), "'today at' h:mm a")
                  : formatDistanceToNow(new Date(lastUsedDate), {
                      addSuffix: true,
                    })}
              </b>
            </>
          ) : (
            ""
          )}
          .
          {session.userAgent && (
            <>
              {" "}
              It's currently running on <b>{uaSummary}</b>, giving you an
              overview of the browser and system in use.
            </>
          )}{" "}
          {session.ipAddress && (
            <>
              {" "}
              The connection originates from the IP address{" "}
              <b>{session.ipAddress}</b>.
            </>
          )}{" "}
          {session.expiresAt && (
            <>
              {" "}
              It's scheduled to expire{" "}
              <b>
                {formatDistanceToNow(new Date(session.expiresAt), {
                  addSuffix: true,
                })}
              </b>
              , after which you'll need to sign in again to continue using your
              account securely.
            </>
          )}{" "}
          {session.id === activeSession.id &&
            "This is the session that's currently active on this device."}
        </p>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SessionCard;
