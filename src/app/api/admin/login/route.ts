import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionCookieValue,
  getAdminSessionCookieOptions,
  verifyAdminPassword,
} from "@/lib/admin/session";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD?.trim()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD is missing or empty. Save .env.local and restart the dev server. If your password contains ! or #, wrap it in quotes.",
      },
      { status: 500 }
    );
  }

  if (!verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  try {
    const token = await createAdminSessionCookieValue();
    const res = NextResponse.json({ ok: true });
    res.cookies.set(ADMIN_COOKIE_NAME, token, getAdminSessionCookieOptions());
    return res;
  } catch {
    return NextResponse.json(
      {
        error:
          "ADMIN_SESSION_SECRET must be at least 16 characters in .env.local",
      },
      { status: 500 }
    );
  }
}
