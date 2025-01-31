import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from "@/components/ui/card";

// Sample data structure for BMI history
const sampleData = [
  { date: '2024-01-01', bmi: 24.5 },
  { date: '2024-01-15', bmi: 24.2 },
  { date: '2024-02-01', bmi: 23.8 },
  { date: '2024-02-15', bmi: 23.5 },
  { date: '2024-03-01', bmi: 23.2 },
].map(entry => ({
  ...entry,
  date: new Date(entry.date).toLocaleDateString(),
}));

interface BmiChartProps {
  data?: Array<{ date: string; bmi: number }>;
}

export function BmiChart({ data = sampleData }: BmiChartProps) {
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">BMI Progress Over Time</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="date"
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis
              domain={['dataMin - 1', 'dataMax + 1']}
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Line
              type="monotone"
              dataKey="bmi"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        Track your BMI changes over time to monitor your progress
      </p>
    </Card>
  );
}
