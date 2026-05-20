"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { BlogPost, BlogPostStatus } from "@/lib/blog/types";

const filters: { label: string; value: BlogPostStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Draft", value: "draft" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Published", value: "published" },
];

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostList() {
  const [filter, setFilter] = useState<BlogPostStatus | "all">("all");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = filter === "all" ? "" : `?status=${filter}`;
      const res = await fetch(`/api/admin/posts${q}`, { credentials: "include" });
      const data = await res.json();
      if (res.ok) setPosts(data.posts ?? []);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    load();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-lg border border-black px-3 py-1 font-mono text-xs transition-colors ${
              filter === f.value ? "bg-pink-primary" : "hover:bg-pink-primary/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-mono text-sm text-black/60">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="font-mono text-sm text-black/60">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-black/15 overflow-hidden rounded-card border border-black">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-5 transition-colors hover:bg-pink-primary/10"
            >
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-medium truncate">{post.title}</p>
                <p className="font-mono text-xs text-black/50">
                  /{post.slug} · {post.status} ·{" "}
                  {post.status === "scheduled"
                    ? `scheduled ${formatDate(post.scheduled_for)}`
                    : formatDate(post.published_at ?? post.updated_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-3 font-mono text-xs">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="underline hover:opacity-70"
                >
                  Edit
                </Link>
                {post.status === "published" && (
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline hover:opacity-70"
                    target="_blank"
                  >
                    View
                  </Link>
                )}
                <button
                  type="button"
                  className="underline hover:opacity-70"
                  onClick={() => remove(post.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
