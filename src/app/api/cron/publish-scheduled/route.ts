import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!secret || bearer !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data: due, error: fetchError } = await supabase
    .from("blog_posts")
    .select("id, scheduled_for")
    .eq("status", "scheduled")
    .lte("scheduled_for", now);

  if (fetchError) {
    console.error(fetchError);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }

  if (!due?.length) {
    return NextResponse.json({ published: 0 });
  }

  let published = 0;
  for (const row of due) {
    const { error } = await supabase
      .from("blog_posts")
      .update({
        status: "published",
        published_at: row.scheduled_for,
        scheduled_for: null,
      })
      .eq("id", row.id);

    if (!error) published += 1;
    else console.error(error);
  }

  return NextResponse.json({ published });
}
