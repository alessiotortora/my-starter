import { db } from "@repo/db"; // your drizzle instance
import * as schema from "@repo/db/schema/auth";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: schema,
	}),
	baseURL: "http://localhost:3000",
	trustedOrigins: ["http://localhost:3001"],
	emailAndPassword: {
		enabled: true,
	},
});
