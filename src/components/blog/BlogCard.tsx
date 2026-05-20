import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import Proximate from "@/components/variable-proximity/Proximate";
import BlogTagList from "@/components/blog/BlogTagList";
import { getCoverPublicUrl } from "@/lib/blog/cover-url";
import type { BlogPost } from "@/lib/blog/types";

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogCard({ post }: { post: BlogPost }) {
  const coverUrl = getCoverPublicUrl(post.cover_image_path);

  return (
    <FadeIn>
      <article className="group flex flex-col overflow-hidden rounded-card border border-black bg-white">
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[4/3] overflow-hidden">
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt=""
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-pink-primary/30 mix-blend-multiply" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-black/5 font-mono text-xs text-black/40">
              No cover image
            </div>
          )}
        </Link>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <time className="font-mono text-[0.65rem] uppercase tracking-widest text-black/50">
            {formatDate(post.published_at)}
          </time>
          <h2 className="font-mono text-lg tracking-tight text-black md:text-xl">
            <Link href={`/blog/${post.slug}`} className="hover:opacity-70">
              <Proximate>{post.title}</Proximate>
            </Link>
          </h2>
          {post.excerpt && (
            <p className="font-mono text-sm leading-relaxed text-black/80 line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <BlogTagList tags={post.tags} />
        </div>
      </article>
    </FadeIn>
  );
}
