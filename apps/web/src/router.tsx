// src/router.tsx
import { createRouter, Link } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultNotFoundComponent: () => (
			<div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
				<div className="text-center">
					<h1 className="font-bold text-6xl text-muted-foreground">404</h1>
					<h2 className="mt-4 font-semibold text-2xl">Page Not Found</h2>
					<p className="mt-2 text-muted-foreground">
						The page you're looking for doesn't exist or has been moved.
					</p>
				</div>
				<Link
					to="/"
					className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 py-2 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					Go Home
				</Link>
			</div>
		),
	});

	return router;
}
