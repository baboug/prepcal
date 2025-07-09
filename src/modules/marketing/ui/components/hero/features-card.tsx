import { BrainIcon, ChartAreaIcon, HandPlatterIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function FeaturesCard() {
  return (
    <Card className="h-full flex-1 border-muted bg-background/60 backdrop-blur-lg">
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4">
          <Feature
            description="Get customized meal plans that adapt to your progress using advanced AI technology"
            icon={<BrainIcon className="size-4" />}
            title="AI-Driven Personalization"
          />
          <Feature
            description="Intelligent meal prep assistance with automated grocery lists and recipe recommendations"
            icon={<HandPlatterIcon className="size-4" />}
            title="Smart Meal Planning"
          />
          <Feature
            description="Track your progress with detailed insights and visual progress charts"
            icon={<ChartAreaIcon className="size-4" />}
            title="Comprehensive Tracking"
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Feature({ icon, title, description }: FeatureProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
}
