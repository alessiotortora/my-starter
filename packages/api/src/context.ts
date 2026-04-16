import type { Session } from "@repo/auth/server";

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
  session: Session | null;
}
