import { createAuthClient } from "better-auth/react";
import { ENV } from "varlock/env";

export const authClient = createAuthClient({
  baseURL: ENV.BETTER_AUTH_URL,
});

export const { signIn, signUp, signOut, useSession } = authClient;
