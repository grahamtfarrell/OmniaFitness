import BookingButton from "@/components/BookingButton";
import BlogShell from "@/components/blog/BlogShell";
import BlogIntro from "@/components/blog/BlogIntro";
import BlogCard from "@/components/blog/BlogCard";
import { getPublishedPosts } from "@/lib/blog/queries";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Omnia Fitness",
  description: "Training notes, community stories, and updates from Omnia Fitness in Denver.",
};

export const revalidate = 60;

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  let loadError = false;

  try {
    posts = await getPublishedPosts();
  } catch {
    loadError = true;
  }

  return (
    <BlogShell>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-32 md:pt-40">
        <BlogIntro />

        {loadError ? (
          <p className="font-mono text-sm text-black/70">
            Blog is not available right now. Please check back soon.
          </p>
        ) : posts.length === 0 ? (
          <div className="text-center">
            <p className="font-mono text-sm leading-relaxed text-black/70">
              No posts yet. Check back soon.
            </p>
            <div className="mt-8 flex justify-center">
              <BookingButton>Book an intro</BookingButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </BlogShell>
  );
}
