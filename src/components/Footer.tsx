import Image from "next/image";
import Proximate from "@/components/variable-proximity/Proximate";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=901+S+Jason+St+%23C+Denver+CO+80223";

const footerLinks = [
  { label: "Contact", href: "mailto:jason@omniafitness.com" },
  { label: "Hours", href: MAPS_URL },
  { label: "Location", href: MAPS_URL },
  { label: "Join newsletter", href: "#newsletter" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-black px-6 py-16 text-pink-primary md:py-20">
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <div className="flex justify-center">
          <Image
            src="/omnia-logo.png"
            alt="Omnia"
            width={160}
            height={48}
            className="h-7 w-auto opacity-95 md:h-8"
          />
        </div>

        <nav
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] md:text-xs md:tracking-[0.22em]"
          aria-label="Footer"
        >
          {footerLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="transition-opacity hover:opacity-60"
            >
              <Proximate>{label}</Proximate>
            </a>
          ))}
        </nav>

        <div className="mt-10 flex justify-center gap-8 md:mt-12">
          <a
            href="https://twitter.com/omniafitness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-primary transition-opacity hover:opacity-60"
            aria-label="X"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://youtube.com/@omniafitness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-primary transition-opacity hover:opacity-60"
            aria-label="YouTube"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a
            href="https://tiktok.com/@omniafitness"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-primary transition-opacity hover:opacity-60"
            aria-label="TikTok"
          >
            <svg
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
