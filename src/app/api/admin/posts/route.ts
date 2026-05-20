import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-auth";
import { parsePostInput } from "@/lib/blog/validate-post";
import { getAllPostsAdmin } from "@/lib/blog/queries";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { BlogPostStatus } from "@/lib/blog/types";

export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as BlogPostStatus | "all" | null;

  try {
    const posts = await getAllPostsAdmin(status ?? "all");
    return NextResponse.json({ posts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = parsePostInput(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(parsed.data)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
