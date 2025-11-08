import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createRouterClient } from "@orpc/server";
import { router } from "@repo/api";
import { createIsomorphicFn } from "@tanstack/react-start";

const getORPCClient = createIsomorphicFn()
	.server(() =>
		createRouterClient(router, {
			context: async () => ({}),
		}),
	)
	.client((): RouterClient<typeof router> => {
		const link = new RPCLink({
			url: "http://localhost:3000/rpc",
		});

		return createORPCClient(link);
	});

export const client: RouterClient<typeof router> = getORPCClient();
