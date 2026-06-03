import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import SplitSection from "@/components/SplitSection";
import Coaches from "@/components/Coaches";
import WhyOmnia from "@/components/WhyOmnia";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="bg-white">
        <BlendLogo />
        <BlendNav />
        <Header />
        <Hero />
        <Marquee />
        <Testimonials />
        <SplitSection />
        <Coaches />
        <WhyOmnia />
        <ShopSection />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}
