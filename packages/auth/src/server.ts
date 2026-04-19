import { createDb } from "@repo/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  buildResetPasswordEmail,
  buildVerificationEmail,
  sendEmail,
} from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(createDb(process.env.DATABASE_URL), {
    provider: "pg",
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_TRUSTED_ORIGIN],
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      const email = buildResetPasswordEmail(user.id, url);
      await sendEmail({ to: user.email, ...email });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const email = buildVerificationEmail(user.id, url);
      await sendEmail({ to: user.email, ...email });
    },
  },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
