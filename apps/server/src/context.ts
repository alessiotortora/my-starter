import type { Context } from "@repo/api/context";
import { auth } from "@repo/auth/server";
import { checkHealth } from "./health";

export async function createContext(request: Request): Promise<Context> {
  const session = await auth.api.getSession({ headers: request.headers });
  return { session, checkHealth };
}
