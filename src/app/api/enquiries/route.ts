import { createHash, randomBytes } from "node:crypto";
import { enquirySchema } from "@/lib/enquiry-schema";

const MAX_BODY_BYTES = 12_000;
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const DEDUPLICATION_WINDOW_MS = 10 * 60 * 1000;
const fingerprintSalt = randomBytes(32);
const recentRequests = new Map<string, { count: number; resetAt: number }>();
const recentSubmissions = new Map<string, number>();

function json(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("Cache-Control", "no-store");
  return Response.json(body, {
    status,
    headers: responseHeaders,
  });
}

function checkRateLimit(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientAddress = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const key = createHash("sha256").update(clientAddress).digest("hex");
  const now = Date.now();

  if (recentRequests.size > 2_000) {
    for (const [entryKey, value] of recentRequests) {
      if (value.resetAt <= now) recentRequests.delete(entryKey);
    }
    while (recentRequests.size > 5_000) {
      const oldestKey = recentRequests.keys().next().value;
      if (!oldestKey) break;
      recentRequests.delete(oldestKey);
    }
  }

  const current = recentRequests.get(key);
  if (current && current.resetAt > now && current.count >= RATE_LIMIT) {
    return Math.max(1, Math.ceil((current.resetAt - now) / 1000));
  }

  recentRequests.set(key, {
    count: current && current.resetAt > now ? current.count + 1 : 1,
    resetAt: current && current.resetAt > now ? current.resetAt : now + RATE_WINDOW_MS,
  });
  return 0;
}

function getWebhookConfig() {
  const rawUrl = process.env.ENQUIRY_WEBHOOK_URL?.trim();
  const secret = process.env.ENQUIRY_WEBHOOK_SECRET?.trim();
  if (!rawUrl || !secret) return { ok: false as const, error: "missing" as const };
  if (secret.length < 32) return { ok: false as const, error: "invalid" as const };

  try {
    const url = new URL(rawUrl);
    const localDevelopment = process.env.NODE_ENV === "development"
      && ["localhost", "127.0.0.1"].includes(url.hostname);
    if (url.protocol !== "https:" && !(localDevelopment && url.protocol === "http:")) {
      return { ok: false as const, error: "invalid" as const };
    }
    return { ok: true as const, url, secret };
  } catch {
    return { ok: false as const, error: "invalid" as const };
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return json({ message: "This enquiry request could not be verified. Please reload the page and try again." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return json({ message: "Send the enquiry as JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return json({ message: "This enquiry is too large. Please shorten the message and try again." }, 413);
  }

  const retryAfter = checkRateLimit(request);
  if (retryAfter > 0) {
    return json(
      { message: "Too many enquiry attempts. Please wait a few minutes or contact the school by phone or WhatsApp." },
      429,
      { "Retry-After": String(retryAfter) },
    );
  }

  let rawBody = "";
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.byteLength;
        if (totalBytes > MAX_BODY_BYTES) {
          await reader.cancel();
          return json({ message: "This enquiry is too large. Please shorten the message and try again." }, 413);
        }
        chunks.push(value);
      }
    } catch {
      return json({ message: "The enquiry could not be read. Please check the form and try again." }, 400);
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bodyBytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    rawBody = new TextDecoder().decode(bodyBytes);
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return json({ message: "The enquiry could not be read. Please check the form and try again." }, 400);
  }

  if (typeof input === "object" && input !== null && "website" in input && input.website) {
    // Quietly accept honeypot submissions without forwarding or storing them.
    return json({ message: "Thank you." }, 202);
  }

  const parsed = enquirySchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return json({ message: "Please check the highlighted enquiry details.", fieldErrors }, 400);
  }

  const webhook = getWebhookConfig();
  if (!webhook.ok && webhook.error === "missing") {
    return json({
      code: "delivery_not_configured",
      message: "Phone enquiries are not connected to a receiving service yet. Use WhatsApp below or call the school.",
    }, 503);
  }
  if (!webhook.ok && webhook.error === "invalid") {
    return json({
      code: "delivery_configuration_invalid",
      message: "The enquiry receiving service is not configured correctly. Please use WhatsApp or call the school.",
    }, 503);
  }

  const fingerprint = createHash("sha256")
    .update(fingerprintSalt)
    .update(JSON.stringify(parsed.data))
    .digest("hex");
  const now = Date.now();
  for (const [key, expiry] of recentSubmissions) {
    if (expiry <= now) recentSubmissions.delete(key);
  }
  if (recentSubmissions.has(fingerprint)) {
    return json({ message: "This enquiry was already submitted recently. Contact the school directly if you need further help." }, 409);
  }
  recentSubmissions.set(fingerprint, now + DEDUPLICATION_WINDOW_MS);
  while (recentSubmissions.size > 5_000) {
    const oldestKey = recentSubmissions.keys().next().value;
    if (!oldestKey) break;
    recentSubmissions.delete(oldestKey);
  }

  const enquiry = { ...parsed.data, contactMethod: "WhatsApp" as const };
  delete enquiry.website;
  try {
    const webhookResponse = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webhook.secret}`,
        "Idempotency-Key": fingerprint,
      },
      body: JSON.stringify({ ...enquiry, receivedAt: new Date().toISOString() }),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(8_000),
    });

    if (!webhookResponse.ok) {
      recentSubmissions.delete(fingerprint);
      return json({ message: "The enquiry service could not accept this request. Please try WhatsApp or call the school." }, 502);
    }
  } catch {
    recentSubmissions.delete(fingerprint);
    return json({ message: "The enquiry service could not be reached. Please try WhatsApp or call the school." }, 502);
  }

  return json({
    message: "Your enquiry was accepted by the configured receiving service. This is not a lesson booking confirmation.",
  }, 202);
}
