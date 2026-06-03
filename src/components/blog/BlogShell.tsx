import Header from "@/components/Header";
import BlendLogo from "@/components/BlendLogo";
import BlendNav from "@/components/BlendNav";
import Footer from "@/components/Footer";

export default function BlogShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="min-h-screen bg-white">
        <BlendLogo />
        <BlendNav />
        <Header />
        {children}
      </main>
      <Footer />
    </>
  );
}
