import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { createContextFactory } from "@repo/api/context";
import { router } from "@repo/api/router";
import { auth } from "@repo/auth/server";
import { createDb } from "@repo/db";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { makeCheckHealth } from "./health";
import { authRoute } from "./hono/auth-route";
import { corsConfig } from "./hono/cors";

export function createApp() {
  const db = createDb(process.env.DATABASE_URL);
  const checkHealth = makeCheckHealth(db);

  const createContext = createContextFactory({
    checkHealth,
    db,
    getSession: (headers) => auth.api.getSession({ headers }),
  });

  const rpcHandler = new RPCHandler(router, {
    interceptors: [
      onError((error) => {
        console.error(error);
      }),
    ],
  });

  const app = new Hono();

  app.use("*", logger());
  app.use("*", cors(corsConfig));

  app.route("/", authRoute);

  app.use("/rpc/*", async (c, next) => {
    const context = await createContext(c.req.raw);
    const { matched, response } = await rpcHandler.handle(c.req.raw, {
      prefix: "/rpc",
      context,
    });

    if (matched) {
      return c.newResponse(response.body, response);
    }

    await next();
  });

  app.get("/", async (c) => c.json(await checkHealth()));

  return app;
}
