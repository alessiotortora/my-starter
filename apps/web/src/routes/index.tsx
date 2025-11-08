// src/routes/index.tsx
import { Button } from "@repo/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { client } from "../lib/orpc";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { data: helloMessage } = useSuspenseQuery({
		queryKey: ["hello"],
		queryFn: () => client.hello(),
	});

	const { data: healthStatus } = useSuspenseQuery({
		queryKey: ["health"],
		queryFn: () => client.health(),
	});

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-4">
			<h1 className="font-bold text-4xl">{helloMessage}</h1>
			<div className="text-lg">
				<p>
					<strong>Status:</strong> {healthStatus.status}
				</p>
				<p>
					<strong>Message:</strong> {healthStatus.message}
				</p>
			</div>
			<Button>Click me</Button>
		</div>
	);
}
