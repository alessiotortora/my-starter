import { auth } from "@repo/auth/server";
import { Hono } from "hono";

export const authRoute = new Hono();

authRoute.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));
