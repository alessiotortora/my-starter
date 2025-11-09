import { RPCHandler } from "@orpc/server/fetch";
import { appRouter } from "@repo/api";
import { createContext } from "@repo/api/context";
import type { Context, Next } from "hono";
import type { Variables } from "../utils";

export async function rpcMiddleware(
	c: Context<{ Variables: Variables }>,
	next: Next,
) {
	const handler = new RPCHandler(appRouter);

	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/rpc",
		context: await createContext({ context: c }),
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
}
