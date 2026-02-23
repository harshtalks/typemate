import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@typemate/auth/auth";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        console.log("💅", request);
        return await auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        console.log("💅", request);
        return await auth.handler(request);
      },
    },
  },
});
