import { createApiClient } from "@repo/api/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const { orpc } = createApiClient("http://localhost:3000");

export const Route = createFileRoute("/")({
  component: Home,
});

const statusColors: Record<string, string> = {
  up: "bg-green-500",
  down: "bg-red-500",
  loading: "bg-yellow-500 animate-pulse",
};

function StatusDot({ status }: { status: "up" | "down" | "loading" }) {
  return (
    <span
      className={`inline-block size-2.5 rounded-full ${statusColors[status]}`}
    />
  );
}

function Home() {
  const health = useQuery(
    orpc.health.queryOptions({
      refetchInterval: 10_000,
    })
  );

  const services = health.data?.services;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="font-bold text-5xl tracking-tight">My Starter</h1>

      <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
        <p className="font-medium text-muted-foreground text-sm">
          Service Status
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <StatusDot
              status={
                health.isPending ? "loading" : (services?.server ?? "down")
              }
            />
            <span>Server</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot
              status={
                health.isPending ? "loading" : (services?.database ?? "down")
              }
            />
            <span>Database</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot
              status={health.isPending ? "loading" : (services?.auth ?? "down")}
            />
            <span>Auth</span>
          </div>
        </div>
        {health.isError && (
          <p className="text-destructive text-xs">Server unreachable</p>
        )}
      </div>
    </div>
  );
}
