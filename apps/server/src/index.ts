import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { corsConfig, serverConfig } from "./config";
import { rpcMiddleware, sessionMiddleware } from "./middleware";
import { authRoutes } from "./routes";
import type { Variables } from "./utils";

const app = new Hono<{ Variables: Variables }>();

app.use("*", logger());

// CORS FIRST (so /api/auth preflights work)
app.use("*", cors(corsConfig));

// Better Auth routes
app.route("/", authRoutes);

// Session middleware for all subsequent routes
app.use("*", sessionMiddleware);

// oRPC middleware at /rpc
app.use("/rpc/*", rpcMiddleware);

// Root route
app.get("/", (c) => {
	return c.json({
		message: "Server is running",
		status: "ok",
		port: serverConfig.port,
	});
});

export default {
	port: serverConfig.port,
	fetch: app.fetch,
};
