import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-bold text-5xl tracking-tight">My Starter</h1>
      <Button disabled>This button is not clickable</Button>
    </div>
  );
}
