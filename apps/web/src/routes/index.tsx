import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@typemate/ui/components/button";
import { NotebookIcon } from "@typemate/ui/components/icons";
import { cn } from "@typemate/ui/lib/utils";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <section className={cn("py-40")}>
      <div className="container mx-auto">
        <div className="flex flex-col items-center gap-5">
          <NotebookIcon className="size-8" />
          <h2 className="text-center font-semibold text-5xl">
            Join our community
            <br />
            <span className="text-muted-foreground/80">
              of designers & developers
            </span>
          </h2>
          <div className="flex items-center gap-4">
            <Link to="/sign-in">
              <Button size="lg" variant="default">
                Sign in
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Know More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
