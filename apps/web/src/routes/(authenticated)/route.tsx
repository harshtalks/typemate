import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Option } from "effect";
import AuthenticatedHeader from "~/components/shared/header";
import { authMiddleware } from "~/middlewares/auth";
import { authRepo } from "~/rpcs/auth";

export const Route = createFileRoute("/(authenticated)")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },
  beforeLoad: async ({ context }) => {
    const { queryKeyFactory, queryClient } = context;

    const user = await queryClient.ensureQueryData({
      queryKey: queryKeyFactory.keys.user(),
      queryFn: () => authRepo.getUser(),
      revalidateIfStale: true,
    });

    return Option.fromNullable(user).pipe(
      Option.match({
        onSome: (user) => ({ user }),
        onNone: () => {
          throw redirect({ to: "/sign-in" });
        },
      })
    );
  },
});

function RouteComponent() {
  return (
    <section className="mx-auto max-w-xl py-12">
      <AuthenticatedHeader />
      <div className="py-40">
        <Outlet />
      </div>
    </section>
  );
}
