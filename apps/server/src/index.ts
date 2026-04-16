import { auth } from "@repo/auth/server";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "/api/auth/*",
  cors({
    origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? "http://localhost:3001",
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get("/", (c) => {
  return c.json({ ok: true });
});

export default app;
