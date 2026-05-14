import { NextResponse } from "next/server";
import {
  normalizePhoneToE164,
  syncIntroLeadToKlaviyo,
} from "@/lib/klaviyo-book-intro";
import { isValidContactInterest } from "@/lib/contact-interest-options";

const MAX_LEN = 200;
const NOTES_MAX = 2500;

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

export async function POST(request: Request) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    return NextResponse.json(
      { ok: false, error: "Server is missing Klaviyo configuration." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid payload." },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, phone, interest, notes } = body as Record<
    string,
    unknown
  >;

  if (!isNonEmptyString(firstName) || firstName.trim().length > MAX_LEN) {
    return NextResponse.json(
      { ok: false, error: "First name is required." },
      { status: 400 },
    );
  }
  if (!isNonEmptyString(lastName) || lastName.trim().length > MAX_LEN) {
    return NextResponse.json(
      { ok: false, error: "Last name is required." },
      { status: 400 },
    );
  }
  if (!isNonEmptyString(email) || email.length > MAX_LEN) {
    return NextResponse.json(
      { ok: false, error: "Email is required." },
      { status: 400 },
    );
  }
  const emailNorm = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!isNonEmptyString(phone)) {
    return NextResponse.json(
      { ok: false, error: "Phone number is required." },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(interest) || !isValidContactInterest(interest.trim())) {
    return NextResponse.json(
      { ok: false, error: "Please choose what you are interested in." },
      { status: 400 },
    );
  }

  let notesTrimmed = "";
  if (notes !== undefined && notes !== null) {
    if (typeof notes !== "string") {
      return NextResponse.json(
        { ok: false, error: "Notes must be text." },
        { status: 400 },
      );
    }
    if (notes.length > NOTES_MAX) {
      return NextResponse.json(
        { ok: false, error: `Notes must be ${NOTES_MAX} characters or fewer.` },
        { status: 400 },
      );
    }
    notesTrimmed = notes.trim();
  }

  const phoneE164 = normalizePhoneToE164(phone);
  if (!phoneE164) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Please enter a valid phone number (include country code, e.g. +1 for US).",
      },
      { status: 400 },
    );
  }

  const properties: Record<string, string> = {
    omnia_interest: interest.trim(),
  };
  if (notesTrimmed) {
    properties.omnia_life_notes = notesTrimmed;
  }

  const result = await syncIntroLeadToKlaviyo({
    apiKey,
    listId,
    email: emailNorm,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    phoneE164,
    properties,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.message },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
