import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Footer from "@/components/Footer";
import Proximate from "@/components/variable-proximity/Proximate";

export const metadata: Metadata = {
  title: "Terms of Service | Omnia Gym",
  description: "Terms of Service for Omnia Gym in Denver, Colorado.",
};

const OMNIA_EMAIL = "info@omniafitco.com";
const OMNIA_ADDRESS = "901 S Jason Street, Unit C, Denver, CO 80223";

export default function TermsOfServicePage() {
  return (
    <>
      <main className="min-h-screen bg-white">
      <BlendLogo />
      <BlendNav />
      <Header />
      <article className="mx-auto max-w-2xl px-6 pb-24 pt-32 md:pt-40">
        <Link
          href="/"
          className="mb-8 inline-block font-mono text-xs uppercase tracking-widest text-black/60 transition-opacity hover:opacity-70"
        >
          ← Back to home
        </Link>

        <h1 className="mb-10 font-mono text-2xl font-normal tracking-tight text-black md:text-3xl">
          <Proximate>Terms of Service</Proximate>
        </h1>

        <div className="space-y-6 font-mono text-sm leading-relaxed text-black/85 md:text-[0.9375rem]">
          <p>
            By using the Omnia Gym website, booking services, or participating in
            classes and programs, you agree to these Terms of Service. Please read
            them carefully.
          </p>
          <p>
            Omnia Gym provides fitness classes, coaching, and related services at{" "}
            {OMNIA_ADDRESS}. Schedules, pricing, and offerings may change. You are
            responsible for consulting a physician before beginning any exercise
            program.
          </p>
          <p>
            You agree to follow gym rules, treat staff and members with respect, and
            use equipment safely. Omnia Gym is not liable for injuries or losses to
            the fullest extent permitted by law. Membership and class policies
            (including cancellations and refunds) are provided at signup and may be
            updated from time to time.
          </p>
          <p>
            Questions about these terms? Contact{" "}
            <a
              href={`mailto:${OMNIA_EMAIL}`}
              className="text-black underline underline-offset-2 hover:opacity-70"
            >
              {OMNIA_EMAIL}
            </a>{" "}
            or write to Omnia Gym, {OMNIA_ADDRESS}. See also our{" "}
            <Link
              href="/policies/privacy-policy"
              className="text-black underline underline-offset-2 hover:opacity-70"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </article>
      </main>
      <Footer />
    </>
  );
}
