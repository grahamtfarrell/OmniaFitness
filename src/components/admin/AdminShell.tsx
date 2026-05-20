import Image from "next/image";
import Link from "next/link";

export const adminBtnPrimary =
  "inline-block rounded-lg border border-black bg-pink-primary px-4 py-2 font-mono text-sm uppercase tracking-widest text-black transition-colors duration-300 hover:bg-transparent disabled:opacity-50";

export const adminBtnSecondary =
  "inline-block rounded-lg border border-black px-4 py-2 font-mono text-sm text-black transition-colors duration-300 hover:bg-pink-primary/40";

export const adminFieldClass =
  "w-full rounded-lg border border-black px-4 py-3 font-mono text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-1 focus:ring-pink-primary";

type AdminShellProps = {
  children: React.ReactNode;
  /** Center content for login (narrow column) */
  narrow?: boolean;
};

export default function AdminShell({ children, narrow }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black bg-black px-6 py-5">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-4 transition-opacity hover:opacity-80">
            <Image
              src="/omnia-logo.png"
              alt="Omnia"
              width={140}
              height={40}
              className="h-6 w-auto md:h-7"
            />
            <span className="hidden font-mono text-xs uppercase tracking-[0.25em] text-pink-primary sm:inline">
              Blog admin
            </span>
          </Link>
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-widest text-pink-primary transition-opacity hover:opacity-70"
          >
            View blog →
          </Link>
        </div>
      </header>

      <div
        className={`mx-auto px-6 py-10 md:py-14 ${
          narrow ? "max-w-md" : "max-w-4xl"
        }`}
      >
        {children}
      </div>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-pink-primary/15 to-transparent" />
    </div>
  );
}
