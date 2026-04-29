import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "File.energy <noreply@file.energy>";

// Lazy singleton — avoids crashing at module load when the key is missing.
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!resendClient) resendClient = new Resend(RESEND_API_KEY);
  return resendClient;
}

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailParams): Promise<{ ok: boolean; error?: string }> {
  const client = getResend();
  if (!client) {
    console.warn(`[email] RESEND_API_KEY not set — would send to ${to}: ${subject}`);
    return { ok: true };
  }

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[email] Resend returned error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send email:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://file.energy";
}

interface SendVerificationEmailParams {
  to: string;
  username: string;
  token: string;
}

export async function sendVerificationEmail({
  to,
  username,
  token,
}: SendVerificationEmailParams): Promise<{ ok: boolean; error?: string }> {
  const verifyUrl = `${getBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const client = getResend();
  if (!client) {
    // Dev convenience: log the link so developers can verify without a key.
    console.warn(
      `[email] RESEND_API_KEY not set — verification link for ${to}: ${verifyUrl}`
    );
    return { ok: true };
  }

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Verify your File.energy email",
      html: renderVerificationEmailHtml({ username, verifyUrl }),
      text: renderVerificationEmailText({ username, verifyUrl }),
    });

    if (error) {
      console.error("[email] Resend returned error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send verification email:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

interface SendPasswordResetEmailParams {
  to: string;
  username: string;
  token: string;
}

export async function sendPasswordResetEmail({
  to,
  username,
  token,
}: SendPasswordResetEmailParams): Promise<{ ok: boolean; error?: string }> {
  const resetUrl = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;

  const client = getResend();
  if (!client) {
    console.warn(
      `[email] RESEND_API_KEY not set — password reset link for ${to}: ${resetUrl}`
    );
    return { ok: true };
  }

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to,
      subject: "Reset your File.energy password",
      html: renderPasswordResetEmailHtml({ username, resetUrl }),
      text: renderPasswordResetEmailText({ username, resetUrl }),
    });

    if (error) {
      console.error("[email] Resend returned error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("[email] Failed to send password reset email:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

function renderVerificationEmailHtml({
  username,
  verifyUrl,
}: {
  username: string;
  verifyUrl: string;
}): string {
  return `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 32px;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <tr>
        <td>
          <h1 style="margin: 0 0 16px; color: #111827; font-size: 22px;">Verify your email</h1>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hi ${escapeHtml(username)},
          </p>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Thanks for signing up for File.energy. Please confirm your email address so you can purchase plans and unlock full access.
          </p>
          <p style="margin: 0 0 32px;">
            <a href="${verifyUrl}" style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px;">
              Verify email
            </a>
          </p>
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="margin: 0 0 24px; color: #6366f1; font-size: 13px; word-break: break-all;">
            ${verifyUrl}
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderVerificationEmailText({
  username,
  verifyUrl,
}: {
  username: string;
  verifyUrl: string;
}): string {
  return `Hi ${username},

Thanks for signing up for File.energy. Please confirm your email address by visiting:

${verifyUrl}

This link expires in 24 hours. If you didn't create an account, you can ignore this email.`;
}

function renderPasswordResetEmailHtml({
  username,
  resetUrl,
}: {
  username: string;
  resetUrl: string;
}): string {
  return `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 32px;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <tr>
        <td>
          <h1 style="margin: 0 0 16px; color: #111827; font-size: 22px;">Reset your password</h1>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hi ${escapeHtml(username)},
          </p>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to set a new one.
          </p>
          <p style="margin: 0 0 32px;">
            <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 15px;">
              Reset password
            </a>
          </p>
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="margin: 0 0 24px; color: #6366f1; font-size: 13px; word-break: break-all;">
            ${resetUrl}
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderPasswordResetEmailText({
  username,
  resetUrl,
}: {
  username: string;
  resetUrl: string;
}): string {
  return `Hi ${username},

We received a request to reset your password. Please reset your password by visiting:

${resetUrl}

This link expires in 1 hour. If you didn't request this, you can ignore this email.`;
}

interface RenderContactAutoReplyHtmlParams {
  firstName: string;
  subject: string;
}

function renderContactAutoReplyHtml({
  firstName,
  subject,
}: RenderContactAutoReplyHtmlParams): string {
  return `<!doctype html>
<html>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 32px;">
    <table role="presentation" width="100%" style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
      <tr>
        <td>
          <h1 style="margin: 0 0 16px; color: #111827; font-size: 22px;">Thank you for contacting us</h1>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Hi ${escapeHtml(firstName)},
          </p>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">
            We have received your message regarding "<strong>${escapeHtml(subject)}</strong>" and our team will get back to you as soon as possible.
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            This is an automated response. Please do not reply directly to this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function renderContactAutoReplyText({
  firstName,
  subject,
}: RenderContactAutoReplyHtmlParams): string {
  return `Hi ${firstName},

Thank you for reaching out to us. We have received your message regarding "${subject}" and our team will get back to you as soon as possible.

Best regards,
The File.energy Team

This is an automated response. Please do not reply directly to this email.`;
}

export { renderContactAutoReplyHtml, renderContactAutoReplyText };

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
