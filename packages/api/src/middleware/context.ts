import type { Session } from "@repo/auth/server";
import type { Database } from "@repo/db";

export interface HealthResult {
  services: {
    server: "up" | "down";
    database: "up" | "down";
    auth: "up" | "down";
  };
  status: "healthy" | "degraded";
  timestamp: string;
}

export interface Context {
  checkHealth: () => Promise<HealthResult>;
  db: Database;
  session: Session | null;
}

export interface ContextDeps {
  checkHealth: () => Promise<HealthResult>;
  db: Database;
  getSession: (headers: Headers) => Promise<Session | null>;
}

export function createContextFactory(deps: ContextDeps) {
  return async (request: Request): Promise<Context> => {
    const session = await deps.getSession(request.headers);
    return {
      checkHealth: deps.checkHealth,
      db: deps.db,
      session,
    };
  };
}
