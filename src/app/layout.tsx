import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Gruppo } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { BookingProvider } from "@/context/BookingContext";
import { NewsletterBannerProvider } from "@/context/NewsletterBannerContext";
import BookingModal from "@/components/BookingModal";
import SmoothScroll from "@/components/SmoothScroll";
import WelcomeModal from "@/components/WelcomeModal";
import { VariableProximityRoot } from "@/components/variable-proximity/VariableProximityRoot";

const gruppo = Gruppo({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gruppo",
});

export const metadata: Metadata = {
  title: "Omnia Fitness | Show up. Be real. Get strong.",
  description:
    "Your goals. Your lifestyle. Omnia - A CrossFit gym dedicated to helping you achieve your fitness goals.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gruppo.variable} font-mono antialiased`}>
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
          <VariableProximityRoot>
            <NewsletterBannerProvider>
              {children}
              <Suspense fallback={null}>
                <WelcomeModal />
              </Suspense>
              <BookingModal />
            </NewsletterBannerProvider>
          </VariableProximityRoot>
        </BookingProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
