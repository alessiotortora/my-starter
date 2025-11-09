import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createRouterClient } from "@orpc/server";
import { type AppRouterClient, appRouter } from "@repo/api";
import { createIsomorphicFn } from "@tanstack/react-start";

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(appRouter, {
			context: async () => {
				// Server-side context will be created by the middleware
				// This is a fallback for SSR
				return { session: null };
			},
		}),
	)
	.client((): AppRouterClient => {
		const link = new RPCLink({
			url: "http://localhost:3000/rpc",
		});

		return createORPCClient(link);
	});

export const client: AppRouterClient = getORPCClient();
