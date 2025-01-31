import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  bodyTypeSchema,
  type BodyTypeInputs,
  type BodyType,
  determineBodyType,
  bodyTypeDescriptions,
} from "@/lib/bodyTypes";
import { ChevronRight, ChevronLeft, Scale, Ruler, Activity } from "lucide-react";

export function BodyTypeQuiz() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<BodyType | null>(null);

  const form = useForm<BodyTypeInputs>({
    resolver: zodResolver(bodyTypeSchema),
    defaultValues: {
      shoulders: "same",
      waist: "defined",
      weightGain: "even",
    },
  });

  const questions = [
    {
      name: "shoulders" as const,
      label: "How do your shoulders compare to your hips?",
      icon: <Ruler className="w-6 h-6 mb-2 text-primary" />,
      options: [
        { value: "narrower", label: "Narrower than hips" },
        { value: "same", label: "About the same as hips" },
        { value: "wider", label: "Wider than hips" },
      ],
    },
    {
      name: "waist" as const,
      label: "How would you describe your waist?",
      icon: <Scale className="w-6 h-6 mb-2 text-primary" />,
      options: [
        { value: "defined", label: "Clearly defined/curvy" },
        { value: "straight", label: "Straight/athletic" },
        { value: "undefined", label: "Softly defined" },
      ],
    },
    {
      name: "weightGain" as const,
      label: "Where do you tend to gain weight first?",
      icon: <Activity className="w-6 h-6 mb-2 text-primary" />,
      options: [
        { value: "even", label: "Evenly throughout body" },
        { value: "middle", label: "Midsection" },
        { value: "bottom", label: "Lower body" },
        { value: "top", label: "Upper body" },
      ],
    },
  ];

  const currentQuestion = questions[step];

  const onSubmit = (data: BodyTypeInputs) => {
    const bodyType = determineBodyType(data);
    setResult(bodyType);
  };

  const nextStep = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  if (result) {
    const bodyInfo = bodyTypeDescriptions[result];
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-primary mb-2">
              {bodyInfo.title}
            </h3>
            <p className="text-muted-foreground">{bodyInfo.description}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Characteristics</h4>
              <ul className="space-y-2 text-sm">
                {bodyInfo.characteristics.map((char, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {char}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm">
                {bodyInfo.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            onClick={() => {
              setResult(null);
              setStep(0);
            }}
          >
            Take Quiz Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="text-center mb-6">
              {currentQuestion.icon}
              <h3 className="text-lg font-semibold mb-1">
                {currentQuestion.label}
              </h3>
              <div className="h-1 w-full bg-muted rounded-full">
                <div
                  className="h-1 bg-primary rounded-full transition-all"
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name={currentQuestion.name}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-2"
                    >
                      {currentQuestion.options.map((option) => (
                        <FormItem
                          key={option.value}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <RadioGroupItem value={option.value} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                {step === questions.length - 1 ? (
                  "See Results"
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
