export const corsConfig = {
	origin: ["http://localhost:3000", "http://localhost:3001"],
	allowMethods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
	allowHeaders: ["Content-Type", "Authorization"],
	credentials: true,
};
