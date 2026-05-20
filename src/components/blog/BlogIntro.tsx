import Image from "next/image";
import Proximate from "@/components/variable-proximity/Proximate";

export default function BlogIntro() {
  return (
    <section className="relative mb-16 overflow-hidden rounded-card border border-black md:mb-20">
      <div className="relative aspect-[21/9] min-h-[200px] w-full md:min-h-[280px]">
        <Image
          src="/fam.jpg"
          alt="Omnia community"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-pink-primary/50 mix-blend-multiply" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          <h1 className="font-mono text-2xl tracking-tight text-white md:text-4xl">
            <Proximate>Blog</Proximate>
          </h1>
          <p className="mt-3 max-w-lg font-mono text-sm leading-relaxed text-white/90 md:text-base">
            <Proximate>
              Training notes, community stories, and what we are learning at Omnia.
            </Proximate>
          </p>
        </div>
      </div>
    </section>
  );
}
