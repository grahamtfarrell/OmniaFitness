/** Klaviyo REST helpers for Book intro — server-only. */

const KLAVIYO_BASE = "https://a.klaviyo.com";
const REVISION = "2026-04-15";

export function normalizePhoneToE164(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (t.startsWith("+")) {
    const rest = t.slice(1).replace(/\D/g, "");
    if (rest.length < 8 || rest.length > 15) return null;
    return `+${rest}`;
  }
  const digits = t.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 8 && digits.length <= 15) return `+${digits}`;
  return null;
}

function authHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: REVISION,
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
  };
}

type KlaviyoErrorBody = {
  errors?: Array<{ title?: string; detail?: string; code?: string }>;
};

export function formatKlaviyoError(status: number, body: unknown): string {
  if (body && typeof body === "object" && "errors" in body) {
    const e = body as KlaviyoErrorBody;
    const first = e.errors?.[0];
    if (first?.detail) return first.detail;
    if (first?.title) return first.title;
  }
  return `Klaviyo request failed (${status})`;
}

async function klaviyoJson<T>(
  apiKey: string,
  path: string,
  init: RequestInit,
): Promise<{ ok: boolean; status: number; data: T | null }> {
  const res = await fetch(`${KLAVIYO_BASE}${path}`, {
    ...init,
    headers: {
      ...authHeaders(apiKey),
      ...init.headers,
    },
  });
  const text = await res.text();
  let data: T | null = null;
  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch {
      data = null;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

type ProfileCreateResponse = {
  data?: { id?: string };
};

export async function createProfile(
  apiKey: string,
  input: {
    email: string;
    firstName: string;
    lastName: string;
    phoneE164: string;
    properties?: Record<string, string>;
  },
): Promise<{ ok: true; profileId: string } | { ok: false; status: number; body: unknown }> {
  const body = {
    data: {
      type: "profile",
      attributes: {
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        phone_number: input.phoneE164,
        ...(input.properties && Object.keys(input.properties).length > 0
          ? { properties: input.properties }
          : {}),
      },
    },
  };
  const { ok, status, data } = await klaviyoJson<ProfileCreateResponse>(
    apiKey,
    "/api/profiles",
    { method: "POST", body: JSON.stringify(body) },
  );
  if (ok && data?.data?.id) return { ok: true, profileId: data.data.id };
  return { ok: false, status, body: data };
}

type ProfilesListResponse = {
  data?: Array<{ id?: string }>;
};

export async function findProfileIdByEmail(
  apiKey: string,
  email: string,
): Promise<string | null> {
  const escaped = email.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const filter = `equals(email,"${escaped}")`;
  const q = new URLSearchParams({ filter });
  const { ok, data } = await klaviyoJson<ProfilesListResponse>(
    apiKey,
    `/api/profiles?${q.toString()}`,
    { method: "GET" },
  );
  if (!ok || !data?.data?.length) return null;
  const id = data.data[0]?.id;
  return id ?? null;
}

export async function updateProfile(
  apiKey: string,
  profileId: string,
  input: {
    email: string;
    firstName: string;
    lastName: string;
    phoneE164: string;
    properties?: Record<string, string>;
  },
): Promise<{ ok: true } | { ok: false; status: number; body: unknown }> {
  const body = {
    data: {
      type: "profile",
      id: profileId,
      attributes: {
        email: input.email,
        first_name: input.firstName,
        last_name: input.lastName,
        phone_number: input.phoneE164,
        ...(input.properties && Object.keys(input.properties).length > 0
          ? { properties: input.properties }
          : {}),
      },
    },
  };
  const { ok, status, data } = await klaviyoJson<unknown>(
    apiKey,
    `/api/profiles/${profileId}`,
    { method: "PATCH", body: JSON.stringify(body) },
  );
  if (ok) return { ok: true };
  return { ok: false, status, body: data };
}

export async function subscribeProfileToList(
  apiKey: string,
  listId: string,
  profileId: string,
  email: string,
): Promise<{ ok: true } | { ok: false; status: number; body: unknown }> {
  const body = {
    data: {
      type: "profile-subscription-bulk-create-job",
      attributes: {
        custom_source: "Omnia website — contact form",
        profiles: {
          data: [
            {
              type: "profile",
              id: profileId,
              attributes: {
                email,
                subscriptions: {
                  email: {
                    marketing: {
                      consent: "SUBSCRIBED",
                    },
                  },
                },
              },
            },
          ],
        },
      },
      relationships: {
        list: {
          data: {
            type: "list",
            id: listId,
          },
        },
      },
    },
  };
  const { ok, status, data } = await klaviyoJson<unknown>(
    apiKey,
    "/api/profile-subscription-bulk-create-jobs",
    { method: "POST", body: JSON.stringify(body) },
  );
  if (ok && status === 202) return { ok: true };
  return { ok: false, status, body: data };
}

export async function syncIntroLeadToKlaviyo(input: {
  apiKey: string;
  listId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneE164: string;
  properties?: Record<string, string>;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const { apiKey, listId } = input;
  const profilePayload = {
    email: input.email,
    firstName: input.firstName,
    lastName: input.lastName,
    phoneE164: input.phoneE164,
    properties: input.properties,
  };

  const created = await createProfile(apiKey, profilePayload);
  let profileId: string | null = null;

  if (created.ok) {
    profileId = created.profileId;
  } else {
    const existingId = await findProfileIdByEmail(apiKey, input.email);
    if (!existingId) {
      return {
        ok: false,
        message: formatKlaviyoError(created.status, created.body),
      };
    }
    const updated = await updateProfile(apiKey, existingId, profilePayload);
    if (!updated.ok) {
      return {
        ok: false,
        message: formatKlaviyoError(updated.status, updated.body),
      };
    }
    profileId = existingId;
  }

  const sub = await subscribeProfileToList(
    apiKey,
    listId,
    profileId,
    input.email,
  );
  if (!sub.ok) {
    return {
      ok: false,
      message: formatKlaviyoError(sub.status, sub.body),
    };
  }

  return { ok: true };
}
