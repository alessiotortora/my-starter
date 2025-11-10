// src/routes/index.tsx
import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession } from "../lib/auth-client";
import { orpc } from "../lib/orpc";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const navigate = useNavigate();
	const { data: session } = useSession();

	const { data: healthStatus } = useQuery(orpc.healthCheck.queryOptions());

	// Redirect to dashboard if already logged in
	useEffect(() => {
		if (session?.user) {
			navigate({ to: "/dashboard" });
		}
	}, [session?.user, navigate]);

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-6">
			<div className="w-full max-w-md space-y-6 rounded-lg border p-8 text-center">
				<h1 className="font-bold text-3xl">Welcome</h1>

				{healthStatus && (
					<div className="rounded-lg bg-muted p-4 text-left">
						<p className="text-muted-foreground text-sm">Server Status</p>
						<p className="font-semibold text-lg">{healthStatus.status}</p>
						<p className="text-sm">{healthStatus.message}</p>
					</div>
				)}

				<div className="flex flex-col gap-3">
					<Button onClick={() => navigate({ to: "/login" })} className="w-full">
						Sign In
					</Button>
					<Button
						onClick={() => navigate({ to: "/signup" })}
						variant="outline"
						className="w-full"
					>
						Sign Up
					</Button>
				</div>
			</div>
		</div>
	);
}
