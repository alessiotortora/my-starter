import type { HealthResult } from "@repo/api/context";
import { createDb } from "@repo/db";

export async function checkHealth(): Promise<HealthResult> {
  let database: "up" | "down" = "down";
  let auth: "up" | "down" = "down";

  try {
    const db = createDb(process.env.DATABASE_URL ?? "");
    await db.execute("SELECT 1");
    database = "up";
  } catch {
    database = "down";
  }

  try {
    const res = await fetch(
      `${process.env.BETTER_AUTH_URL ?? "http://localhost:3000"}/api/auth/ok`
    );
    if (res.ok) {
      auth = "up";
    }
  } catch {
    auth = "down";
  }

  const services = { server: "up" as const, database, auth };
  const allUp = database === "up" && auth === "up";

  return {
    status: allUp ? "healthy" : "degraded",
    services,
    timestamp: new Date().toISOString(),
  };
}
