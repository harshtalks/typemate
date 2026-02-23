import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import {
  getRequestHeaders,
  setResponseHeader,
} from "@tanstack/react-start/server";
import { auth } from "@typemate/auth/auth";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(),
    returnHeaders: true,
    query: {
      disableCookieCache: true,
    },
  });

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  if (!session?.response?.user) {
    throw redirect({ to: "/sign-in" });
  }

  return next({
    context: {
      user: session.response.user,
      session: session.response.session,
    },
  });
});
