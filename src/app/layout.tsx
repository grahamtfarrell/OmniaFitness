import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Gruppo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { NewsletterBannerProvider } from "@/context/NewsletterBannerContext";
import { WelcomeModalProvider } from "@/context/WelcomeModalContext";
import BookingModal from "@/components/BookingModal";
import SmoothScroll from "@/components/SmoothScroll";
import WelcomeModal from "@/components/WelcomeModal";
import { VariableProximityRoot } from "@/components/variable-proximity/VariableProximityRoot";

const gruppo = Gruppo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gruppo",
});

const SITE_NAME = "Omnia Fitness Collective";
const SITE_URL = "https://omniafitco.com";
const SITE_DESCRIPTION =
  "Your goals. Your lifestyle. Omnia. A CrossFit gym dedicated to helping you achieve your fitness goals.";
const SHARE_IMAGE = {
  url: "/bottom.jpg",
  width: 2500,
  height: 1184,
  alt: "Omnia Fitness Collective gym in Denver",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Show up. Be real. Get strong.`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Show up. Be real. Get strong.`,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Show up. Be real. Get strong.`,
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE.url],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/omnia-o.png`,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };

  return (
    <html lang="en">
      <body className={`${gruppo.variable} font-mono antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
          }}
        />
        <SmoothScroll>
        <Script
          id="klaviyo-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return\"push\"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t=\"function\"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();",
          }}
        />
        <Script
          src="https://static.klaviyo.com/onsite/js/We668q/klaviyo.js?company_id=We668q"
          strategy="afterInteractive"
        />
        <BookingProvider>
          <WelcomeModalProvider>
            <VariableProximityRoot>
              <NewsletterBannerProvider>
                {children}
                <Suspense fallback={null}>
                  <WelcomeModal />
                </Suspense>
                <BookingModal />
              </NewsletterBannerProvider>
            </VariableProximityRoot>
          </WelcomeModalProvider>
        </BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
