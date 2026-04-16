import type { Session } from "@repo/auth/server";

export interface Context {
  session: Session | null;
}
