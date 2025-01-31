export type BmiCategory = "Underweight" | "Normal" | "Overweight" | "Obese";

export function calculateBmi(
  height: number,
  weight: number,
  metric: boolean
): number | null {
  if (!height || !weight) return null;

  let bmi: number;
  
  if (metric) {
    // Metric formula: weight (kg) / (height (m))²
    const heightInMeters = height / 100;
    bmi = weight / (heightInMeters * heightInMeters);
  } else {
    // Imperial formula: (weight (lbs) * 703) / (height (inches))²
    bmi = (weight * 703) / (height * height);
  }

  return Number.isFinite(bmi) ? bmi : null;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}
