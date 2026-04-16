export const serverConfig = {
  port: Number(process.env.PORT ?? 3000),
};

export const corsConfig = {
  origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN ?? "http://localhost:3001",
  credentials: true as const,
};
