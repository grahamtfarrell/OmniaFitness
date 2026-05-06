import Image from "next/image";

export default function Footer() {
  return (
    <footer 
      className="text-white py-12 px-6 min-h-[500px]"
      style={{
        backgroundImage: "url('/bottom.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-xl mx-auto text-center">
        {/* Large Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/omnia-o.png"
            alt="Omnia"
            width={300}
            height={300}
            className="h-72 md:h-96 w-auto"
          />
        </div>

        {/* Contact */}
        <div className="mb-4">
          <div className="font-mono text-base flex justify-between items-end">
            <span>Contact</span>
            <span className="flex-1 border-b border-dotted border-white mx-2 mb-1"></span>
            <span>jason@omniafitness.com</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <div className="font-mono text-base flex justify-between items-end">
            <span>Pricing</span>
            <span className="flex-1 border-b border-dotted border-white mx-2 mb-1"></span>
            <span>$420 /mo</span>
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <div className="font-mono text-base flex justify-between items-end">
            <span>Location</span>
            <span className="flex-1 border-b border-dotted border-white mx-2 mb-1"></span>
            <span>901 S Jason St # C, Denver, CO 80223</span>
          </div>
        </div>

        {/* Hours */}
        <div className="mb-6">
          <div className="font-mono text-base flex justify-between items-end">
            <span>Hours</span>
            <span className="flex-1 border-b border-dotted border-white mx-2 mb-1"></span>
            <span>9-5 M-S</span>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mb-6">
          <button className="border border-white px-6 py-3 font-mono text-base tracking-wide hover:bg-pink-primary hover:text-black hover:border-pink-primary transition-all duration-300">
            subscribe to newsletter
          </button>
        </div>

        {/* Bottom Icons */}
        <div className="flex justify-center gap-6">
          <a
            href="https://twitter.com/omniafitness"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-6 h-6 fill-white"
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
            className="hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-6 h-6 fill-white"
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
            className="hover:opacity-70 transition-opacity"
          >
            <svg
              className="w-6 h-6 fill-white"
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
