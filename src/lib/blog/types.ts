export type BlogPostStatus = "draft" | "scheduled" | "published";

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: Record<string, unknown>;
  meta_description: string;
  cover_image_path: string | null;
  tags: string[];
  status: BlogPostStatus;
  published_at: string | null;
  scheduled_for: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostInput = {
  slug: string;
  title: string;
  excerpt: string;
  body: Record<string, unknown>;
  meta_description: string;
  cover_image_path: string | null;
  tags: string[];
  status: BlogPostStatus;
  published_at: string | null;
  scheduled_for: string | null;
};
