import { Button } from "@repo/ui/components/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSession } from "../lib/auth-client";

export const Route = createFileRoute("/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	const navigate = useNavigate();
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div>Loading...</div>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="flex h-screen flex-col items-center justify-center gap-4">
				<div className="text-center">
					<h1 className="font-bold text-2xl">Not Authenticated</h1>
					<p className="mt-2 text-muted-foreground">
						Please sign in to access the dashboard.
					</p>
					<Button onClick={() => navigate({ to: "/login" })} className="mt-4">
						Go to Sign In
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<div className="w-full max-w-2xl space-y-6 rounded-lg border p-8">
				<div className="flex items-center justify-between">
					<h1 className="font-bold text-2xl">Dashboard</h1>
					<Button variant="outline" onClick={() => navigate({ to: "/" })}>
						Home
					</Button>
				</div>

				<div className="space-y-4">
					<div className="rounded-lg border p-4">
						<h2 className="mb-3 font-semibold text-lg">Session Information</h2>
						<div className="space-y-2 text-sm">
							<div>
								<strong>Session ID:</strong> {session.session?.id || "N/A"}
							</div>
							<div>
								<strong>Expires At:</strong>{" "}
								{session.session?.expiresAt
									? new Date(session.session.expiresAt).toLocaleString()
									: "N/A"}
							</div>
						</div>
					</div>

					<div className="rounded-lg border p-4">
						<h2 className="mb-3 font-semibold text-lg">User Information</h2>
						<div className="space-y-2 text-sm">
							<div>
								<strong>ID:</strong> {session.user.id}
							</div>
							<div>
								<strong>Name:</strong> {session.user.name || "N/A"}
							</div>
							<div>
								<strong>Email:</strong> {session.user.email}
							</div>
							<div>
								<strong>Email Verified:</strong>{" "}
								{session.user.emailVerified ? "Yes" : "No"}
							</div>
							{session.user.image && (
								<div>
									<strong>Image:</strong> {session.user.image}
								</div>
							)}
							<div>
								<strong>Created At:</strong>{" "}
								{session.user.createdAt
									? new Date(session.user.createdAt).toLocaleString()
									: "N/A"}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
