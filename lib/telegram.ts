const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface SendResult {
  ok: boolean;
  error?: string;
}

async function sendTelegramMessage(text: string): Promise<SendResult> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    // Dev convenience: log instead of failing when the bot isn't configured.
    console.warn(
      `[telegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set — skipping notification: ${text}`
    );
    return { ok: true };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("[telegram] sendMessage failed:", res.status, body);
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[telegram] Failed to send message:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

const SITE_NAME = "File.energy";

export async function notifyUserRegistered({
  email,
  username,
  ip,
}: {
  email: string;
  username: string;
  ip?: string;
}): Promise<SendResult> {
  const ipLine = ip ? `\nIP: ${escapeHtml(ip)}` : "";
  const text =
    `🆕 <b>[${SITE_NAME}] New user registered</b>\n` +
    `Username: ${escapeHtml(username)}\n` +
    `Email: ${escapeHtml(email)}${ipLine}`;
  return sendTelegramMessage(text);
}

export async function notifyEmailVerified({
  email,
}: {
  email: string;
}): Promise<SendResult> {
  const text =
    `✅ <b>[${SITE_NAME}] Email verified</b>\n` +
    `Email: ${escapeHtml(email)}`;
  return sendTelegramMessage(text);
}

export async function notifyPhoneVerificationStarted({
  email,
  phone,
}: {
  email: string;
  phone: string;
}): Promise<SendResult> {
  const text =
    `📱 <b>[${SITE_NAME}] Phone verification started</b>\n` +
    `Email: ${escapeHtml(email)}\n` +
    `Phone: ${escapeHtml(phone)}`;
  return sendTelegramMessage(text);
}

export async function notifyPhoneVerified({
  email,
  phone,
}: {
  email: string;
  phone: string;
}): Promise<SendResult> {
  const text =
    `✅ <b>[${SITE_NAME}] Phone verified</b>\n` +
    `Email: ${escapeHtml(email)}\n` +
    `Phone: ${escapeHtml(phone)}`;
  return sendTelegramMessage(text);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
