import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig, serverConfig } from "./config";
import { checkHealth } from "./health";
import { rpcMiddleware } from "./middleware";
import { authRoutes } from "./routes";

const app = new Hono();

app.use("*", logger());
app.use("*", cors(corsConfig));

app.route("/", authRoutes);

app.use("/rpc/*", rpcMiddleware);

app.get("/", async (c) => {
  const health = await checkHealth();
  return c.json(health);
});

export default {
  port: serverConfig.port,
  fetch: app.fetch,
};
