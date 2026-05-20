import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_MAX_AGE_SEC,
  createAdminSessionCookieValue,
  isAdminTokenValid,
  verifyAdminPassword,
} from "@/lib/admin/session-token";

export {
  ADMIN_COOKIE_NAME,
  createAdminSessionCookieValue,
  verifyAdminPassword,
  isAdminTokenValid,
};

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  return isAdminTokenValid(token);
}
