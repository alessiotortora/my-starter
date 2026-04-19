import { createHash } from "node:crypto";
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM;

const resend = apiKey ? new Resend(apiKey) : null;

interface SendArgs {
  html: string;
  idempotencyKey?: string;
  subject: string;
  to: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  idempotencyKey,
}: SendArgs) {
  if (!resend) {
    // Dev fallback when RESEND_API_KEY is not set — log so signup and
    // password flows don't break locally.
    process.stdout.write(
      `\n📧 [dev] Email (RESEND_API_KEY unset)\n  to: ${to}\n  subject: ${subject}\n  body: ${html}\n\n`
    );
    return;
  }

  const { error } = await resend.emails.send(
    { from, to, subject, html },
    idempotencyKey ? { idempotencyKey } : undefined
  );
  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }
}

function hashUrl(url: string) {
  return createHash("sha256").update(url).digest("hex").slice(0, 16);
}

export function buildVerificationEmail(userId: string, url: string) {
  return {
    subject: "Verify your email",
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p><p>If you didn't request this, you can ignore it.</p>`,
    idempotencyKey: `verify-email/${userId}/${hashUrl(url)}`,
  };
}

export function buildResetPasswordEmail(userId: string, url: string) {
  return {
    subject: "Reset your password",
    html: `<p>Click <a href="${url}">here</a> to reset your password.</p><p>If you didn't request this, you can ignore it.</p>`,
    idempotencyKey: `reset-password/${userId}/${hashUrl(url)}`,
  };
}
