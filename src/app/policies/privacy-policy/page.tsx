import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Footer from "@/components/Footer";
import Proximate from "@/components/variable-proximity/Proximate";

export const metadata: Metadata = {
  title: "Privacy Policy | Omnia Gym",
  description: "Privacy Policy for Omnia Gym in Denver, Colorado.",
};

const OMNIA_EMAIL = "info@omniafitco.com";
const OMNIA_ADDRESS = "901 S Jason Street, Unit C, Denver, CO 80223";

export default function PrivacyPolicyPage() {
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
          <Proximate>Privacy Policy</Proximate>
        </h1>

        <div className="space-y-10 font-mono text-sm leading-relaxed text-black md:text-[0.9375rem]">
          <section>
            <h2 className="mb-3 text-base font-normal uppercase tracking-wide">
              Privacy Statement
            </h2>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Section 1 — What do we do with your information?
            </h2>
            <p className="mb-3 text-black/85">
              When you sign up for a class, membership, intro session, or other
              services at Omnia Gym, as part of the registration and communication
              process we collect the personal information you give us such as your
              name, address, email address, and phone number.
            </p>
            <p className="mb-3 text-black/85">
              When you browse our website, we also automatically receive your
              computer&apos;s internet protocol (IP) address in order to provide us
              with information that helps us learn about your browser and operating
              system.
            </p>
            <p className="text-black/85">
              Email and text marketing (if applicable): With your permission, we
              may send you emails or texts about our gym, classes, events, new
              programs, and other updates.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">Section 2 — Consent</h2>
            <p className="mb-3 font-normal text-black">How do you get my consent?</p>
            <p className="mb-3 text-black/85">
              When you provide us with personal information to complete a
              registration, book an intro, verify payment, arrange for a visit, or
              return a purchase, we imply that you consent to our collecting it and
              using it for that specific reason only.
            </p>
            <p className="mb-4 text-black/85">
              If we ask for your personal information for a secondary reason, like
              marketing, we will either ask you directly for your expressed consent,
              or provide you with an opportunity to say no.
            </p>
            <p className="mb-3 font-normal text-black">
              How do I withdraw my consent?
            </p>
            <p className="text-black/85">
              If after you opt in you change your mind, you may withdraw your
              consent for us to contact you, or for the continued collection, use, or
              disclosure of your information, at any time by contacting us at{" "}
              <a
                href={`mailto:${OMNIA_EMAIL}`}
                className="text-black underline underline-offset-2 hover:opacity-70"
              >
                {OMNIA_EMAIL}
              </a>{" "}
              or mailing us at: Omnia Gym, {OMNIA_ADDRESS}.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">Section 3 — Disclosure</h2>
            <p className="text-black/85">
              We may disclose your personal information if we are required by law
              to do so or if you violate our Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Section 4 — Hosting &amp; online services
            </h2>
            <p className="mb-3 text-black/85">
              Our website and related tools are hosted and operated using
              third-party platforms that allow us to offer our services to you.
              Your data may be stored through those providers&apos; data storage,
              databases, and applications on secure servers behind a firewall.
            </p>
            <p className="text-black/85">
              Payment: If you choose a direct payment gateway to complete a
              purchase, your payment provider stores your payment data. It is
              encrypted through industry-standard security practices. Your purchase
              transaction data is stored only as long as is necessary to complete
              your purchase transaction. After that is complete, your purchase
              transaction information is deleted. Payment gateways adhere to
              standards such as PCI-DSS to help ensure the secure handling of
              payment information by our gym and its service providers.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Section 5 — Third-party services
            </h2>
            <p className="mb-3 text-black/85">
              In general, the third-party providers used by us will only collect,
              use, and disclose your information to the extent necessary to allow
              them to perform the services they provide to us (for example, email
              marketing, scheduling, or analytics).
            </p>
            <p className="mb-3 text-black/85">
              However, certain third-party service providers, such as payment
              gateways and other payment transaction processors, have their own
              privacy policies in respect to the information we are required to
              provide to them for your purchase-related transactions.
            </p>
            <p className="mb-3 text-black/85">
              For these providers, we recommend that you read their privacy policies
              so you can understand the manner in which your personal information
              will be handled by these providers.
            </p>
            <p className="mb-3 text-black/85">
              In particular, remember that certain providers may be located in or
              have facilities that are located in a different jurisdiction than
              either you or us. If you elect to proceed with a transaction that
              involves the services of a third-party service provider, then your
              information may become subject to the laws of the jurisdiction(s) in
              which that service provider or its facilities are located.
            </p>
            <p className="mb-3 text-black/85">
              Once you leave our website or are redirected to a third-party website
              or application, you are no longer governed by this Privacy Policy or
              our website&apos;s Terms of Service.
            </p>
            <p className="mb-3 font-normal text-black">Links</p>
            <p className="mb-3 text-black/85">
              When you click on links on our website, they may direct you away from
              our site. We are not responsible for the privacy practices of other
              sites and encourage you to read their privacy statements.
            </p>
            <p className="font-normal text-black">Analytics</p>
            <p className="text-black/85">
              Our website may use analytics tools to help us learn about site visits
              and the pages being viewed.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">Section 6 — Security</h2>
            <p className="text-black/85">
              To protect your personal information, we take reasonable precautions
              and follow industry best practices to make sure it is not
              inappropriately lost, misused, accessed, disclosed, altered, or
              destroyed. If you provide us with payment information, the information
              is encrypted using secure socket layer technology (SSL) where
              applicable. Although no method of transmission over the Internet or
              electronic storage is 100% secure, we follow generally accepted
              industry standards.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">Section 7 — Cookies</h2>
            <p className="mb-3 text-black/85">
              Here is a list of cookies that we may use. We&apos;ve listed them here
              so that you can choose if you want to opt out of cookies or not.
            </p>
            <ul className="list-inside list-disc space-y-2 text-black/85">
              <li>
                Session cookies — allow our site to store information about your
                session (referrer, landing page, etc.).
              </li>
              <li>
                Analytics cookies — used to record the number of visits and how
                visitors use the site.
              </li>
              <li>
                Preference cookies — used to remember your settings where
                applicable.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Section 8 — Age of consent
            </h2>
            <p className="text-black/85">
              By using this site, you represent that you are at least the age of
              majority in your state or province of residence, or that you are the
              age of majority in your state or province of residence and you have
              given us your consent to allow any of your minor dependents to use
              this site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Section 9 — Changes to this privacy policy
            </h2>
            <p className="text-black/85">
              We reserve the right to modify this privacy policy at any time, so
              please review it frequently. Changes and clarifications will take
              effect immediately upon their posting on the website. If we make
              material changes to this policy, we will notify you here that it has
              been updated, so that you are aware of what information we collect, how
              we use it, and under what circumstances, if any, we use and/or
              disclose it. If our gym is acquired or merged with another company,
              your information may be transferred to the new owners so that we may
              continue to provide services to you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-normal">
              Questions and contact information
            </h2>
            <p className="text-black/85">
              If you would like to access, correct, amend, or delete any personal
              information we have about you, register a complaint, or simply want
              more information, contact us at{" "}
              <a
                href={`mailto:${OMNIA_EMAIL}`}
                className="text-black underline underline-offset-2 hover:opacity-70"
              >
                {OMNIA_EMAIL}
              </a>{" "}
              or by mail at Omnia Gym, [Re: Privacy Compliance], {OMNIA_ADDRESS}.
            </p>
          </section>
        </div>
      </article>
      </main>
      <Footer />
    </>
  );
}
