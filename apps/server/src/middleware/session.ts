import { auth } from "@repo/auth";
import type { Context, Next } from "hono";
import type { Variables } from "../utils";

/**
 * Middleware to extract session and user from Better Auth
 * and attach them to the Hono context
 */
export async function sessionMiddleware(
	c: Context<{ Variables: Variables }>,
	next: Next,
) {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	c.set("user", session?.user ?? null);
	c.set("session", session?.session ?? null);

	await next();
}
