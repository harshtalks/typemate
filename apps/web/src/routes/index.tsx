import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@typemate/ui/components/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="container mx-auto px-4">
      <Button variant={"destructive"}>hLeoo</Button>
    </div>
  );
}
