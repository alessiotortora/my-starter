import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serverConfig } from "./config";
import { rpcMiddleware, sessionMiddleware } from "./middleware";
import { authRoutes } from "./routes";
import type { Variables } from "./utils";

const app = new Hono<{ Variables: Variables }>();

app.use("*", logger());

// CORS configuration for Better Auth
app.use(
	"/api/auth/*",
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:3001",
		allowHeaders: ["Content-Type", "Authorization"],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length"],
		maxAge: 600,
		credentials: true,
	}),
);

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
