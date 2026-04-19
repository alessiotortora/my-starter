import type { HealthResult } from "@repo/api/context";
import type { Database } from "@repo/db";

export function makeCheckHealth(db: Database) {
  return async (): Promise<HealthResult> => {
    let database: "up" | "down" = "down";
    let authStatus: "up" | "down" = "down";

    try {
      await db.execute("SELECT 1");
      database = "up";
    } catch {
      database = "down";
    }

    try {
      const res = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/ok`);
      if (res.ok) {
        authStatus = "up";
      }
    } catch {
      authStatus = "down";
    }

    const services = {
      server: "up" as const,
      database,
      auth: authStatus,
    };
    const allUp = database === "up" && authStatus === "up";

    return {
      status: allUp ? "healthy" : "degraded",
      services,
      timestamp: new Date().toISOString(),
    };
  };
}
