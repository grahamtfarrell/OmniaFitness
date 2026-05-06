import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Pricing from "@/components/Pricing";
import SplitSection from "@/components/SplitSection";
import Coaches from "@/components/Coaches";
import WhyOmnia from "@/components/WhyOmnia";
import ShopSection from "@/components/ShopSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <BlendLogo />
      <BlendNav />
      <Header />
      <Hero />
      <Marquee />
      <SplitSection />
      <Coaches />
      <WhyOmnia />
      <Pricing />
      <ShopSection />
      <Footer />
    </main>
  );
}
