// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getQueryClient } from "~/lib/react-query";
import { routeTree } from "~/routeTree.gen";

export function getRouter() {
  const queryClient = getQueryClient();

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      queryClient,
    },
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
