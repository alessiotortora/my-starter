import { useSession } from "@repo/auth/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SignInForm } from "@/components/auth/sign-in-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/")({
  component: Home,
});

const statusColors: Record<string, string> = {
  up: "bg-emerald-500",
  down: "bg-red-500",
  loading: "bg-amber-500 animate-pulse",
};

function StatusDot({ status }: { status: "up" | "down" | "loading" }) {
  return (
    <span
      className={`inline-block size-2 rounded-full ${statusColors[status]}`}
    />
  );
}

function ServiceStatus() {
  const health = useQuery(
    orpc.health.queryOptions({ refetchInterval: 10_000 })
  );
  const services = health.data?.services;

  const rows: Array<{ label: string; status: "up" | "down" | "loading" }> = [
    {
      label: "Server",
      status: health.isPending ? "loading" : (services?.server ?? "down"),
    },
    {
      label: "Database",
      status: health.isPending ? "loading" : (services?.database ?? "down"),
    },
    {
      label: "Auth",
      status: health.isPending ? "loading" : (services?.auth ?? "down"),
    },
  ];

  return (
    <div className="flex flex-col gap-2 text-sm">
      {rows.map((row) => (
        <div className="flex items-center gap-2" key={row.label}>
          <StatusDot status={row.status} />
          <span>{row.label}</span>
        </div>
      ))}
      {health.isError && (
        <p className="text-destructive text-xs">Server unreachable</p>
      )}
    </div>
  );
}

function Home() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && session) {
      navigate({ to: "/dashboard" });
    }
  }, [isPending, session, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2">
        <h1 className="font-bold text-4xl tracking-tight">My Starter</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to continue to your dashboard
        </p>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Create an account or sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Service status</CardTitle>
        </CardHeader>
        <CardContent>
          <ServiceStatus />
        </CardContent>
      </Card>
    </div>
  );
}
