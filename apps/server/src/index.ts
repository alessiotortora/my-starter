import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@repo/api/router";
import { auth } from "@repo/auth/server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

app.use(
  "/*",
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? "http://localhost:3001",
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context: {},
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

app.get("/", (c) => {
  return c.json({ ok: true });
});

export default app;
