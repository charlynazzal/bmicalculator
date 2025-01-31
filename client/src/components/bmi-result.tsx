import { Progress } from "@/components/ui/progress";
import { getBmiCategory, type BmiCategory } from "@/lib/bmi";

const categoryColors: Record<BmiCategory, string> = {
  "Underweight": "text-blue-500",
  "Normal": "text-green-500",
  "Overweight": "text-yellow-500",
  "Obese": "text-red-500",
};

const categoryGradients: Record<BmiCategory, string> = {
  "Underweight": "from-blue-500/20 to-blue-500/5",
  "Normal": "from-green-500/20 to-green-500/5",
  "Overweight": "from-yellow-500/20 to-yellow-500/5",
  "Obese": "from-red-500/20 to-red-500/5",
};

interface BmiResultProps {
  bmi: number | null;
}

export function BmiResult({ bmi }: BmiResultProps) {
  if (!bmi) {
    return (
      <div className="text-center text-muted-foreground">
        Enter your height and weight to calculate BMI
      </div>
    );
  }

  const category = getBmiCategory(bmi);
  const progress = Math.min(Math.max((bmi / 40) * 100, 0), 100);

  return (
    <div className={`p-6 rounded-lg bg-gradient-to-b ${categoryGradients[category]}`}>
      <div className="mb-4">
        <div className="text-2xl font-bold mb-1">
          Your BMI: <span className={categoryColors[category]}>{bmi.toFixed(1)}</span>
        </div>
        <div className={`font-medium ${categoryColors[category]}`}>
          Category: {category}
        </div>
      </div>

      <Progress value={progress} className="h-2" />
      
      <div className="mt-4 text-sm text-muted-foreground">
        <div className="grid grid-cols-4 text-center">
          <div>Underweight</div>
          <div>Normal</div>
          <div>Overweight</div>
          <div>Obese</div>
        </div>
        <div className="grid grid-cols-4 text-center text-xs mt-1">
          <div>&lt;18.5</div>
          <div>18.5-24.9</div>
          <div>25-29.9</div>
          <div>&gt;30</div>
        </div>
      </div>
    </div>
  );
}
