import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./migrations",
	schema: ["./src/schema/auth.ts"],
	dialect: "postgresql",
	casing: "snake_case",
	dbCredentials: {
		url: process.env.DATABASE_URL || "",
	},
});
