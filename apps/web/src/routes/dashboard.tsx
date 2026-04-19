import { useSession } from "@repo/auth/client";
import { Skeleton } from "@repo/ui/components/skeleton";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { PostsPanel } from "@/components/posts/posts-panel";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(isPending || session)) {
      navigate({ to: "/" });
    }
  }, [isPending, session, navigate]);

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!session) {
    // Redirect effect will fire; render nothing meanwhile.
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-semibold text-2xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOutButton />
      </header>
      <PostsPanel userId={session.user.id} />
    </div>
  );
}
