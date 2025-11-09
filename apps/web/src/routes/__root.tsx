// src/routes/__root.tsx
/// <reference types="vite/client" />

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import appCss from "../styles.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	component: RootComponent,
	notFoundComponent: NotFound,
});

function RootComponent() {
	return (
		<QueryClientProvider client={queryClient}>
			<RootDocument>
				<Outlet />
			</RootDocument>
		</QueryClientProvider>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	);
}

function NotFound() {
	return (
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
	);
}
