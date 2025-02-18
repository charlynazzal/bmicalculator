import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateBmi, getBmiCategory } from "@/lib/bmi";
import { BmiResult } from "./bmi-result";
import { BmiRecommendations } from "./bmi-recommendations";
import { BmiChart } from "./bmi-chart";
import { BmiReport } from "./bmi-report";
import { BodyTypeQuiz } from "./body-type-quiz";

const formSchema = z.object({
  height: z.coerce.number().positive("Height must be positive").max(300, "Height seems too large"),
  weight: z.coerce.number().positive("Weight must be positive").max(500, "Weight seems too large"),
});

type FormValues = z.infer<typeof formSchema>;

export function BmiCalculator() {
  const [useMetric, setUseMetric] = useState(true);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      height: 0,
      weight: 0,
    },
  });

  const bmi = calculateBmi(
    form.watch("height"),
    form.watch("weight"),
    useMetric
  );

  const category = bmi ? getBmiCategory(bmi) : null;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calculator">BMI Calculator</TabsTrigger>
          <TabsTrigger value="bodytype">Body Type Quiz</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-end space-x-2 mb-6">
                <Label htmlFor="unit-toggle">Imperial</Label>
                <Switch
                  id="unit-toggle"
                  checked={useMetric}
                  onCheckedChange={setUseMetric}
                />
                <Label htmlFor="unit-toggle">Metric</Label>
              </div>

              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height {useMetric ? "(cm)" : "(inches)"}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={useMetric ? "170" : "67"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight {useMetric ? "(kg)" : "(lbs)"}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={useMetric ? "70" : "154"}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              <div className="mt-8">
                <BmiResult bmi={bmi} />
                <BmiRecommendations category={category} />
                <BmiReport 
                  bmi={bmi}
                  category={category}
                  metric={useMetric}
                  height={form.watch("height")}
                  weight={form.watch("weight")}
                />
              </div>
            </CardContent>
          </Card>

          <BmiChart />
        </TabsContent>

        <TabsContent value="bodytype">
          <BodyTypeQuiz />
        </TabsContent>
      </Tabs>
    </div>
  );
}