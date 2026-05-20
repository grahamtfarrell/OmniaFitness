export const ADMIN_COOKIE_NAME = "omnia_admin_session";
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 16) return null;
  return secret;
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacSign(message: string): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

async function hmacVerify(message: string, signature: string): Promise<boolean> {
  const expected = await hmacSign(message);
  if (!expected || expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export async function createAdminSessionCookieValue(): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE_SEC;
  const payload = `admin:${exp}`;
  const sig = await hmacSign(payload);
  if (!sig) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 16 characters");
  }
  return `${toBase64Url(new TextEncoder().encode(payload))}.${sig}`;
}

export async function isAdminTokenValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return false;
  let payload: string;
  try {
    payload = new TextDecoder().decode(fromBase64Url(encoded));
  } catch {
    return false;
  }
  if (!(await hmacVerify(payload, sig))) return false;
  const match = payload.match(/^admin:(\d+)$/);
  if (!match) return false;
  const exp = Number(match[1]);
  return exp > Math.floor(Date.now() / 1000);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected) return false;
  const p = password.trim();
  if (p.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < p.length; i++) {
    diff |= p.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
