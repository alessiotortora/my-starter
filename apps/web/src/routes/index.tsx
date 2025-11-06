// src/routes/index.tsx
import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<div className="flex h-screen flex-col items-center justify-center">
			<h1 className="font-bold text-4xl">Hello World</h1>
			<Button>Click me</Button>
		</div>
	);
}
