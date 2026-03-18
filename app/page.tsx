import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import PopularDestinations from "@/components/PopularDestinations";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PopularDestinations />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
