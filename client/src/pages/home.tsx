import { BmiCalculator } from "@/components/bmi-calculator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
            BMI Calculator
          </h1>
          <p className="text-muted-foreground">
            Calculate your Body Mass Index and understand your body composition
          </p>
        </div>
        <BmiCalculator />
      </div>
    </div>
  );
}