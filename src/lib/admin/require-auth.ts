import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/session";

export async function requireAdminApi(): Promise<NextResponse | null> {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
