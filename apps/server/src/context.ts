import type { Context } from "@repo/api/context";
import { auth } from "@repo/auth/server";

export async function createContext(request: Request): Promise<Context> {
  const session = await auth.api.getSession({ headers: request.headers });
  return { session };
}
