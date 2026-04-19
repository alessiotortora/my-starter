export const corsConfig = {
  origin: process.env.BETTER_AUTH_TRUSTED_ORIGIN,
  credentials: true as const,
};
