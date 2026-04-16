import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { router } from "@repo/api/router";
import type { Context as HonoContext, Next } from "hono";
import { createContext } from "./context";

const rpcHandler = new RPCHandler(router, {
  interceptors: [
    onError((error) => {
      console.error(error);
    }),
  ],
});

export async function rpcMiddleware(c: HonoContext, next: Next) {
  const context = await createContext(c.req.raw);

  const { matched, response } = await rpcHandler.handle(c.req.raw, {
    prefix: "/rpc",
    context,
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
}
