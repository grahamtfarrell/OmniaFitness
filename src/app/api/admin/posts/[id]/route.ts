import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin/require-auth";
import { parsePostInput } from "@/lib/blog/validate-post";
import { getPostByIdAdmin } from "@/lib/blog/queries";
import { createServiceRoleClient } from "@/lib/supabase/server";

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  try {
    const post = await getPostByIdAdmin(params.id);
    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
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
    .update(parsed.data)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }

  return NextResponse.json({ post: data });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const auth = await requireAdminApi();
  if (auth) return auth;

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
