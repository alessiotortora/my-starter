import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
// biome-ignore lint/performance/noNamespaceImport: drizzle requires schema as namespace
import * as schema from "./schema";

export function createDb(databaseUrl: string) {
  const client = postgres(databaseUrl);
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
