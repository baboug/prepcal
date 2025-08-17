"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type FAQItem = {
  id: string;
  icon: IconName;
  question: string;
  answer: string;
};

export function FAQs() {
  const faqItems: FAQItem[] = [
    {
      id: "item-1",
      icon: "brain",
      question: "How does AI meal planning work?",
      answer:
        "Our AI analyzes your nutrition targets, dietary preferences, and food restrictions to generate meal plans that hit your exact macro and calorie goals. It considers thousands of recipe combinations to find the optimal balance.",
    },
    {
      id: "item-2",
      icon: "target",
      question: "How accurate are the nutrition calculations?",
      answer:
        "Our nutrition calculations achieve 95% accuracy by using comprehensive food databases and precise recipe parsing. We account for cooking methods, ingredient variations, and serving sizes to ensure reliable macro tracking.",
    },
    {
      id: "item-3",
      icon: "utensils",
      question: "Can I import recipes from any website?",
      answer:
        "Yes! Our recipe scraper works with virtually any cooking website including AllRecipes, Food Network, Bon Appétit, and thousands more. We automatically extract ingredients, instructions, and calculate nutrition.",
    },
    {
      id: "item-4",
      icon: "apple",
      question: "Which diet protocols do you support?",
      answer:
        "We support standard flexible dieting, ketogenic diets with custom carb limits, and Leangains intermittent fasting with meal timing optimization. Each protocol has specialized calculations and meal plan generation.",
    },
    {
      id: "item-5",
      icon: "smartphone",
      question: "Is there a mobile app?",
      answer:
        "Our web app is fully responsive and works perfectly on mobile devices. We're currently developing native iOS and Android apps for even better mobile experience, coming in 2024.",
    },
  ];

  return (
    <section className="bg-muted py-20 dark:bg-background">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-3xl tracking-tighter">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground">
                Have more questions? Reach out to our{" "}
                <span className="cursor-pointer text-primary hover:underline">support team</span> and we'll help you
                out.
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion className="w-full space-y-2" collapsible type="single">
              {faqItems.map((item) => (
                <AccordionItem
                  className="rounded-lg border bg-background px-4 shadow-xs last:border-b"
                  key={item.id}
                  value={item.id}
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon className="m-auto size-4" name={item.icon} />
                      </div>
                      <span className="text-base">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
