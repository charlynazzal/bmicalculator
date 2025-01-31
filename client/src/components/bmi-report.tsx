import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { type BmiCategory } from "@/lib/bmi";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface BmiReportProps {
  bmi: number | null;
  category: BmiCategory | null;
  metric: boolean;
  height: number;
  weight: number;
}

export function BmiReport({
  bmi,
  category,
  metric,
  height,
  weight,
}: BmiReportProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const exportReport = async () => {
    if (!reportRef.current || !bmi || !category) return;

    try {
      const canvas = await html2canvas(reportRef.current);
      const image = canvas.toDataURL("image/png");
      
      // Create a link element to download the image
      const link = document.createElement("a");
      link.href = image;
      link.download = `bmi-report-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Success!",
        description: "Your BMI report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareReport = async () => {
    if (!bmi || !category) return;

    const reportText = `
My BMI Report:
BMI: ${bmi.toFixed(1)}
Category: ${category}
Height: ${height}${metric ? "cm" : "inches"}
Weight: ${weight}${metric ? "kg" : "lbs"}
Generated on: ${new Date().toLocaleDateString()}
    `.trim();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "My BMI Report",
          text: reportText,
        });
        toast({
          title: "Success!",
          description: "Your BMI report has been shared.",
        });
      } else {
        await navigator.clipboard.writeText(reportText);
        toast({
          title: "Success!",
          description: "Report copied to clipboard!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share report. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!bmi || !category) return null;

  return (
    <div className="space-y-4">
      <div
        ref={reportRef}
        className="p-6 bg-card rounded-lg border shadow-sm space-y-4"
      >
        <h3 className="text-lg font-semibold text-center">BMI Report</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">BMI:</span> {bmi.toFixed(1)}
          </p>
          <p>
            <span className="font-medium">Category:</span> {category}
          </p>
          <p>
            <span className="font-medium">Height:</span> {height}
            {metric ? "cm" : "inches"}
          </p>
          <p>
            <span className="font-medium">Weight:</span> {weight}
            {metric ? "kg" : "lbs"}
          </p>
          <p className="text-sm text-muted-foreground">
            Generated on: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={exportReport}
          className="w-full"
          variant="outline"
        >
          Download Report
        </Button>
        <Button
          onClick={shareReport}
          className="w-full"
          variant="default"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Report
        </Button>
      </div>
    </div>
  );
}
