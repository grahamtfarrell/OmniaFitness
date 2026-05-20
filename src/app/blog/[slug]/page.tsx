import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BookingButton from "@/components/BookingButton";
import BlogShell from "@/components/blog/BlogShell";
import BlogTagList from "@/components/blog/BlogTagList";
import { getCoverPublicUrl } from "@/lib/blog/cover-url";
import { getPublishedPostBySlug, getPublishedSlugs } from "@/lib/blog/queries";
import { tiptapJsonToHtml } from "@/lib/blog/tiptap-to-html";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: { slug: string } };

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await getPublishedPostBySlug(params.slug);
    if (!post) return { title: "Blog | Omnia Fitness" };
    return {
      title: `${post.title} | Omnia Fitness`,
      description: post.meta_description || post.excerpt || undefined,
    };
  } catch {
    return { title: "Blog | Omnia Fitness" };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getPublishedPostBySlug(params.slug).catch(() => null);

  if (!post) notFound();

  const coverUrl = getCoverPublicUrl(post.cover_image_path);
  const html = tiptapJsonToHtml(post.body);

  return (
    <BlogShell>
      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
        {coverUrl && (
          <div className="relative mb-10 aspect-[16/10] overflow-hidden rounded-card border border-black">
            <Image
              src={coverUrl}
              alt=""
              fill
              unoptimized
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
            <div className="pointer-events-none absolute inset-0 bg-pink-primary/25 mix-blend-multiply" />
          </div>
        )}

        <header className="mb-8">
          <time className="font-mono text-[0.65rem] uppercase tracking-widest text-black/50">
            {formatDate(post.published_at)}
          </time>
          <h1 className="mt-3 font-mono text-2xl font-normal tracking-tight text-black md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4">
            <BlogTagList tags={post.tags} />
          </div>
        </header>

        {html ? (
          <div
            className="blog-prose font-mono text-sm leading-relaxed text-black md:text-base"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <p className="font-mono text-sm text-black/70">No content yet.</p>
        )}

        <div className="mt-16 flex justify-center border-t border-black/10 pt-12">
          <BookingButton>Book an intro</BookingButton>
        </div>
      </article>
    </BlogShell>
  );
}
