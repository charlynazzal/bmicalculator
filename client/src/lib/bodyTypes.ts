import { z } from "zod";

export const bodyTypeSchema = z.object({
  shoulders: z.enum(["narrower", "same", "wider"]).describe("Shoulders compared to hips"),
  waist: z.enum(["defined", "straight", "undefined"]).describe("Waist definition"),
  weightGain: z.enum(["even", "middle", "bottom", "top"]).describe("Weight gain pattern"),
});

export type BodyTypeInputs = z.infer<typeof bodyTypeSchema>;

export type BodyType = 
  | "ectomorph"
  | "mesomorph"
  | "endomorph";

export const bodyTypeDescriptions: Record<BodyType, {
  title: string;
  description: string;
  characteristics: string[];
  recommendations: string[];
}> = {
  ectomorph: {
    title: "Ectomorph",
    description: "Naturally lean and long, with difficulty gaining weight",
    characteristics: [
      "Narrow shoulders and hips",
      "Long limbs",
      "Fast metabolism",
      "Difficulty gaining weight"
    ],
    recommendations: [
      "Focus on strength training",
      "Increase caloric intake",
      "Eat protein-rich foods",
      "Include complex carbohydrates"
    ]
  },
  mesomorph: {
    title: "Mesomorph",
    description: "Athletic and muscular, with a medium frame",
    characteristics: [
      "Athletic build",
      "Gains muscle easily",
      "Responsive to exercise",
      "Medium-sized joints/bones"
    ],
    recommendations: [
      "Balance cardio and strength training",
      "Moderate protein intake",
      "Watch portion sizes",
      "Stay consistent with exercise"
    ]
  },
  endomorph: {
    title: "Endomorph",
    description: "Naturally broad and strong, with slower metabolism",
    characteristics: [
      "Wider frame",
      "Stores fat easily",
      "Strong lower body",
      "Slower metabolism"
    ],
    recommendations: [
      "Regular cardio exercise",
      "High-protein, low-carb diet",
      "Strength training",
      "Portion control"
    ]
  }
};

export function determineBodyType(inputs: BodyTypeInputs): BodyType {
  const { shoulders, waist, weightGain } = inputs;
  
  // Scoring system
  let ectomorphScore = 0;
  let mesomorphScore = 0;
  let endomorphScore = 0;

  // Shoulder analysis
  if (shoulders === "narrower") ectomorphScore += 2;
  if (shoulders === "same") mesomorphScore += 2;
  if (shoulders === "wider") endomorphScore += 2;

  // Waist analysis
  if (waist === "straight") ectomorphScore += 2;
  if (waist === "defined") mesomorphScore += 2;
  if (waist === "undefined") endomorphScore += 2;

  // Weight gain pattern
  if (weightGain === "even") mesomorphScore += 2;
  if (weightGain === "top" || weightGain === "bottom") endomorphScore += 2;
  if (weightGain === "middle") ectomorphScore += 1;

  // Determine dominant type
  const scores = {
    ectomorph: ectomorphScore,
    mesomorph: mesomorphScore,
    endomorph: endomorphScore
  };

  return Object.entries(scores).reduce((a, b) => 
    scores[a as BodyType] > scores[b[0] as BodyType] ? a : b[0]
  ) as BodyType;
}
