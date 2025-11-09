import type { RouterClient } from "@orpc/server";
import { protectedProcedure, publicProcedure } from "./procedures";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => {
		return {
			status: "healthy",
			message: "Server is running and healthy",
		};
	}),
	hello: protectedProcedure.handler(() => {
		return "Hello World, hono with orpc and tanstack are setup.";
	}),
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
