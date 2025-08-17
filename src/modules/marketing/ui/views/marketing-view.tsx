"use client";

import { CallToAction } from "@/modules/marketing/ui/components/call-to-action";
import { FAQs } from "@/modules/marketing/ui/components/faqs";
import { FeaturesAIPowered } from "@/modules/marketing/ui/components/features-ai-powered";
import { FeaturesComprehensive } from "@/modules/marketing/ui/components/features-comprehensive";
import { Footer } from "@/modules/marketing/ui/components/footer";
import { Hero } from "@/modules/marketing/ui/components/hero";
import { Pricing } from "@/modules/marketing/ui/components/pricing";
import { RecipeIntegrations } from "@/modules/marketing/ui/components/recipe-integrations";

export function MarketingView() {
  return (
    <main className="scroll-smooth">
      <Hero />
      <section className="scroll-mt-20" id="features">
        <FeaturesAIPowered />
        <FeaturesComprehensive />
      </section>
      <RecipeIntegrations />
      <section className="scroll-mt-20" id="pricing">
        <Pricing />
      </section>
      <section className="scroll-mt-20" id="faqs">
        <FAQs />
      </section>
      <CallToAction />
      <Footer />
    </main>
  );
}
