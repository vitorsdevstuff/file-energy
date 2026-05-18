const PRELUDE_API_KEY = process.env.PRELUDE_API_KEY;
const PRELUDE_BASE_URL = "https://api.prelude.dev/v2";

interface PreludeResponse {
  ok: boolean;
  status?: number;
  data?: Record<string, unknown>;
  error?: string;
}

interface SendVerificationParams {
  phone: string;
  correlationId?: string;
}

interface CheckVerificationParams {
  phone: string;
  code: string;
}

async function preludeRequest(
  path: string,
  body: Record<string, unknown>
): Promise<PreludeResponse> {
  if (!PRELUDE_API_KEY) {
    console.warn(
      "[prelude] PRELUDE_API_KEY not set — skipping API call"
    );
    return { ok: true };
  }

  const url = `${PRELUDE_BASE_URL}${path}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRELUDE_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorBody = data as Record<string, string>;
      const message = errorBody.message || errorBody.code || `HTTP ${res.status}`;
      const errorType = errorBody.type || "unknown";
      console.error(
        `[prelude] API error: ${res.status} ${res.statusText} — type=${errorType} message=${message} body=${JSON.stringify(data)}`
      );
      return { ok: false, status: res.status, error: `${message} (${errorType})` };
    }

    return { ok: true, status: res.status, data: data as Record<string, unknown> };
  } catch (err) {
    console.error("[prelude] Request failed:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function sendPhoneVerification({
  phone,
  correlationId,
}: SendVerificationParams): Promise<PreludeResponse> {
  return preludeRequest("/verification", {
    target: {
      type: "phone_number",
      value: phone,
    },
    options: {
      method: "message",
      preferred_channel: "sms",
      code_size: 4,
    },
    ...(correlationId && {
      metadata: { correlation_id: correlationId },
    }),
  });
}

export async function checkPhoneVerification({
  phone,
  code,
}: CheckVerificationParams): Promise<PreludeResponse> {
  return preludeRequest("/verification/check", {
    target: {
      type: "phone_number",
      value: phone,
    },
    code,
  });
}

export function isPreludeConfigured(): boolean {
  return Boolean(PRELUDE_API_KEY);
}