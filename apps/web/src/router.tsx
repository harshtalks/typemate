// src/router.tsx
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import { getQueryClient, queryKeyFactory } from "~/lib/react-query";
import { routeTree } from "~/routeTree.gen";
import ErrorComponent from "./components/shared/error";
import NotFound from "./components/shared/not-found";

export function getRouter() {
  const queryClient = getQueryClient();

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      queryClient,
      queryKeyFactory,
    },
    defaultErrorComponent: ErrorComponent,
    defaultNotFoundComponent: NotFound,
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
