import { os } from "@orpc/server";

export const router = {
	hello: os.handler(() => {
		return "Hello World, hono with orpc and tanstack are setup.";
	}),
	health: os.handler(() => {
		return {
			status: "healthy",
			message: "Server is running and healthy",
		};
	}),
};
