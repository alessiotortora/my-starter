import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@repo/api";
import { Hono } from "hono";

const app = new Hono();

const handler = new RPCHandler(router);

app.use("/rpc/*", async (c, next) => {
	const { matched, response } = await handler.handle(c.req.raw, {
		prefix: "/rpc",
		context: {},
	});

	if (matched) {
		return c.newResponse(response.body, response);
	}

	await next();
});

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

export default {
	port,
	fetch: app.fetch,
};
