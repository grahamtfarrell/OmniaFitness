import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Footer from "@/components/Footer";
import Proximate from "@/components/variable-proximity/Proximate";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pb-[max(7rem,calc(4.5rem+env(safe-area-inset-bottom,0px)))] md:pb-0">
      <BlendLogo />
      <BlendNav />
      <Header />
      <article className="mx-auto max-w-xl px-6 pb-24 pt-32 md:pt-40">
        <h1 className="mb-8 font-mono text-2xl font-normal tracking-tight text-black md:text-3xl">
          <Proximate>About Omnia</Proximate>
        </h1>
        <p className="mb-6 font-mono text-sm leading-relaxed text-black md:text-base">
          <Proximate>
            Omnia is a CrossFit gym in Denver focused on real training, real community,
            and sustainable progress. Stop by for a class or book an intro to meet the
            coaches and see the space.
          </Proximate>
        </p>
        <p className="font-mono text-sm leading-relaxed text-black md:text-base">
          Questions? Email{" "}
          <a
            href="mailto:jason@omniafitness.com"
            className="underline decoration-black/30 underline-offset-2 hover:opacity-70"
          >
            jason@omniafitness.com
          </a>
          .
        </p>
      </article>
      <Footer />
    </main>
  );
}
