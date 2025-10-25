import Footer from "@/components/marketing/footer";
import Navbar from "@/components/marketing/navbar";
import Wrapper from "@/components/global/wrapper";
import Analysis from "@/components/marketing/analysis";
import Companies from "@/components/marketing/companies";
import CTA from "@/components/marketing/cta";
import Features from "@/components/marketing/features";
import Hero from "@/components/marketing/hero";
import Integration from "@/components/marketing/integration";
import LanguageSupport from "@/components/marketing/lang-support";

export default function HomePage() {
  return (
    <>
      <Navbar sticky={true} />
      <main className="mx-auto w-full z-40 relative">
        <Wrapper className="py-20 relative">
          <Hero />
          <Companies />
          <Features />
          <Analysis />
          <Integration />
          <LanguageSupport />
          <CTA />
        </Wrapper>
      </main>
      <Footer />
    </>
  );
}
