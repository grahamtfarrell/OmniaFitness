import { createAnonServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import type { BlogPost, BlogPostStatus } from "@/lib/blog/types";

export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createAnonServerClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}

export async function getPublishedSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts();
  return posts.map((p) => p.slug);
}

export async function getAllPostsAdmin(status?: BlogPostStatus | "all"): Promise<BlogPost[]> {
  const supabase = createServiceRoleClient();
  let query = supabase.from("blog_posts").select("*").order("updated_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as BlogPost[];
}

export async function getPostByIdAdmin(id: string): Promise<BlogPost | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data as BlogPost | null) ?? null;
}
