"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/admin/RichTextEditor";
import TagInput from "@/components/admin/TagInput";
import { slugifyTitle } from "@/lib/blog/slug";
import { getCoverPublicUrl } from "@/lib/blog/cover-url";
import type { BlogPost, BlogPostStatus } from "@/lib/blog/types";
import {
  adminBtnPrimary,
  adminBtnSecondary,
  adminFieldClass,
} from "@/components/admin/AdminShell";

const EMPTY_BODY = { type: "doc", content: [] };

type PostEditorFormProps = {
  postId?: string;
  initial?: Partial<BlogPost>;
};

export default function PostEditorForm({ postId, initial }: PostEditorFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description ?? "");
  const [body, setBody] = useState<Record<string, unknown>>(
    (initial?.body as Record<string, unknown>) ?? EMPTY_BODY
  );
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [status, setStatus] = useState<BlogPostStatus>(initial?.status ?? "draft");
  const [scheduledFor, setScheduledFor] = useState(() => {
    if (!initial?.scheduled_for) return "";
    return initial.scheduled_for.slice(0, 16);
  });
  const [coverPath, setCoverPath] = useState<string | null>(initial?.cover_image_path ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverSuccess, setCoverSuccess] = useState<string | null>(null);

  const coverUrl = getCoverPublicUrl(coverPath);

  const onTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugifyTitle(v));
  };

  const buildPayload = useCallback(
    (nextStatus: BlogPostStatus) => {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        meta_description: metaDescription.trim(),
        body,
        tags,
        status: nextStatus,
        cover_image_path: coverPath,
      };

      if (nextStatus === "published") {
        payload.published_at = initial?.published_at ?? new Date().toISOString();
        payload.scheduled_for = null;
      } else if (nextStatus === "scheduled") {
        payload.scheduled_for = scheduledFor
          ? new Date(scheduledFor).toISOString()
          : null;
        payload.published_at = null;
      } else {
        payload.published_at = null;
        payload.scheduled_for = null;
      }

      return payload;
    },
    [title, slug, excerpt, metaDescription, body, tags, coverPath, scheduledFor, initial?.published_at]
  );

  const save = async (nextStatus: BlogPostStatus) => {
    setError(null);
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    if (nextStatus === "scheduled" && !scheduledFor) {
      setError("Pick a date and time for scheduled posts.");
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(nextStatus);
      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Save failed");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onCoverChange = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setCoverSuccess(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-cover", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed");
        return;
      }
      setCoverPath(data.path);
      setCoverSuccess("Cover uploaded. Click Publish now or Save draft to attach it to this post.");
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      className="space-y-6 rounded-card border border-black bg-pink-primary/10 p-6 md:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        save(status);
      }}
    >
      {error && (
        <p className="rounded-lg border border-black bg-pink-primary/30 px-4 py-2 font-mono text-sm text-black">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Title
        </label>
        <input
          className={adminFieldClass}
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Slug
        </label>
        <input
          className={adminFieldClass}
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
          required
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Excerpt
        </label>
        <textarea
          className={`${adminFieldClass} min-h-[80px] resize-y`}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Meta description (SEO)
        </label>
        <textarea
          className={`${adminFieldClass} min-h-[60px] resize-y`}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          rows={2}
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Tags
        </label>
        <TagInput tags={tags} onChange={setTags} />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Cover image
        </label>
        {coverUrl && (
          <div className="relative mb-3 aspect-[16/9] max-w-md overflow-hidden rounded-lg border border-black">
            <Image src={coverUrl} alt="Cover preview" fill className="object-cover" />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          disabled={uploading}
          onChange={(e) => onCoverChange(e.target.files?.[0] ?? null)}
          className="font-mono text-sm"
        />
        <p className="mt-2 font-mono text-xs text-black/50">
          JPEG, PNG, or WebP (max 5MB). iPhone HEIC must be converted to JPEG first.
        </p>
        {uploading && <p className="mt-1 font-mono text-xs text-black/60">Uploading…</p>}
        {coverSuccess && (
          <p className="mt-2 rounded-lg border border-black bg-pink-primary/50 px-3 py-2 font-mono text-xs text-black">
            {coverSuccess}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
          Body
        </label>
        <RichTextEditor value={body} onChange={setBody} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
            Status
          </label>
          <select
            className={adminFieldClass}
            value={status}
            onChange={(e) => setStatus(e.target.value as BlogPostStatus)}
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
        </div>
        {status === "scheduled" && (
          <div>
            <label className="mb-1 block font-mono text-xs uppercase tracking-widest text-black/70">
              Publish at
            </label>
            <input
              type="datetime-local"
              className={adminFieldClass}
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              required
            />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          className={adminBtnPrimary}
          disabled={saving}
          onClick={() => save("draft")}
        >
          Save draft
        </button>
        <button
          type="button"
          className={adminBtnPrimary}
          disabled={saving}
          onClick={() => save("published")}
        >
          Publish now
        </button>
        <button
          type="button"
          className={adminBtnPrimary}
          disabled={saving}
          onClick={() => {
            setStatus("scheduled");
            save("scheduled");
          }}
        >
          Schedule
        </button>
        <button
          type="button"
          className={adminBtnSecondary}
          onClick={() => router.push("/admin")}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
