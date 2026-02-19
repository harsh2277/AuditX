import { Navbar } from "../components/landing/Navbar";
import { HeroSection } from "../components/landing/HeroSection";
import { ProblemSection } from "../components/landing/ProblemSection";
import { SolutionSection } from "../components/landing/SolutionSection";
import { FormatsSection } from "../components/landing/FormatsSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { DemoSection } from "../components/landing/DemoSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { CollaborationSection } from "../components/landing/CollaborationSection";
import { UseCasesSection } from "../components/landing/UseCasesSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { PricingSection } from "../components/landing/PricingSection";
import { CTAFooter } from "../components/landing/CTAFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F8]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FormatsSection />
        <HowItWorksSection />
        <DemoSection />
        <FeaturesSection />
        <CollaborationSection />
        <UseCasesSection />
        <TestimonialsSection />
        <PricingSection />
      </main>
      <CTAFooter />
    </div>
  );
}
