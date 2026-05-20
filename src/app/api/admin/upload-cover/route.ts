import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-auth";
import { BLOG_COVERS_BUCKET } from "@/lib/blog/cover-url";
import {
  extensionForContentType,
  validateCoverFile,
} from "@/lib/blog/image-upload";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const validated = validateCoverFile(file);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
  }

  const ext = extensionForContentType(validated.contentType);
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;

  const supabase = createServiceRoleClient();
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(BLOG_COVERS_BUCKET).upload(path, buffer, {
    contentType: validated.contentType,
    upsert: false,
  });

  if (error) {
    console.error(error);
    const msg =
      error.message?.includes("Bucket not found")
        ? "Storage bucket blog-covers is missing — run the Supabase migration."
        : error.message ?? "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ path });
}
