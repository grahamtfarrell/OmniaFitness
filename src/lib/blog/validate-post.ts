import type { BlogPostInput, BlogPostStatus } from "@/lib/blog/types";

const STATUSES: BlogPostStatus[] = ["draft", "scheduled", "published"];

export function parsePostInput(body: unknown): { ok: true; data: BlogPostInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid body" };
  }
  const b = body as Record<string, unknown>;

  const title = typeof b.title === "string" ? b.title.trim() : "";
  const slug = typeof b.slug === "string" ? b.slug.trim() : "";
  const excerpt = typeof b.excerpt === "string" ? b.excerpt.trim() : "";
  const meta_description =
    typeof b.meta_description === "string" ? b.meta_description.trim() : "";
  const status = typeof b.status === "string" ? b.status : "draft";
  const cover_image_path =
    b.cover_image_path === null || typeof b.cover_image_path === "string"
      ? (b.cover_image_path as string | null)
      : null;

  if (!title) return { ok: false, error: "Title is required" };
  if (!slug) return { ok: false, error: "Slug is required" };
  if (!STATUSES.includes(status as BlogPostStatus)) {
    return { ok: false, error: "Invalid status" };
  }

  const tags = Array.isArray(b.tags)
    ? b.tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const postBody =
    b.body && typeof b.body === "object" && !Array.isArray(b.body)
      ? (b.body as Record<string, unknown>)
      : { type: "doc", content: [] };

  let published_at: string | null =
    typeof b.published_at === "string" ? b.published_at : null;
  let scheduled_for: string | null =
    typeof b.scheduled_for === "string" ? b.scheduled_for : null;

  const st = status as BlogPostStatus;

  if (st === "published") {
    if (!published_at) published_at = new Date().toISOString();
    scheduled_for = null;
  } else if (st === "scheduled") {
    if (!scheduled_for) {
      return { ok: false, error: "Scheduled date is required for scheduled posts" };
    }
    published_at = null;
  } else {
    published_at = null;
    scheduled_for = null;
  }

  return {
    ok: true,
    data: {
      title,
      slug,
      excerpt,
      body: postBody,
      meta_description,
      cover_image_path,
      tags,
      status: st,
      published_at,
      scheduled_for,
    },
  };
}
