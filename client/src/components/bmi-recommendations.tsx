import { type BmiCategory } from "@/lib/bmi";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

interface BmiRecommendationsProps {
  category: BmiCategory | null;
}

const recommendations: Record<BmiCategory, {
  title: string;
  tips: string[];
  lifestyle: string[];
}> = {
  "Underweight": {
    title: "Healthy Weight Gain Tips",
    tips: [
      "Eat more frequently throughout the day",
      "Choose nutrient-rich foods",
      "Add healthy snacks between meals"
    ],
    lifestyle: [
      "Incorporate strength training exercises",
      "Consult with a nutritionist for a personalized meal plan",
      "Track your caloric intake to ensure sufficient energy"
    ]
  },
  "Normal": {
    title: "Maintain Your Healthy Weight",
    tips: [
      "Continue balanced, portion-controlled meals",
      "Eat a variety of foods from all food groups",
      "Stay hydrated with water throughout the day"
    ],
    lifestyle: [
      "Regular physical activity (150 minutes/week)",
      "Get adequate sleep (7-9 hours/night)",
      "Practice stress management techniques"
    ]
  },
  "Overweight": {
    title: "Weight Management Strategies",
    tips: [
      "Reduce portion sizes gradually",
      "Choose whole grains over refined grains",
      "Increase intake of vegetables and fruits"
    ],
    lifestyle: [
      "Aim for 30 minutes of daily physical activity",
      "Keep a food diary to track eating patterns",
      "Find support through friends or health professionals"
    ]
  },
  "Obese": {
    title: "Health Improvement Steps",
    tips: [
      "Focus on whole, unprocessed foods",
      "Control portion sizes with smaller plates",
      "Plan meals ahead to avoid unhealthy choices"
    ],
    lifestyle: [
      "Start with low-impact exercises like walking or swimming",
      "Consider working with a healthcare provider",
      "Set realistic, achievable goals"
    ]
  }
};

export function BmiRecommendations({ category }: BmiRecommendationsProps) {
  if (!category) return null;

  const { title, tips, lifestyle } = recommendations[category];

  return (
    <Card className="p-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Dietary Recommendations:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2">Lifestyle Changes:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {lifestyle.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Note: These are general recommendations. Please consult with healthcare professionals for personalized advice.
        </p>
      </div>
    </Card>
  );
}
