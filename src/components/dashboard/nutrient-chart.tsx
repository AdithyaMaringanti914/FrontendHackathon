'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  consumed: {
    label: 'Consumed',
    color: 'hsl(var(--primary))',
  },
  goal: {
    label: 'Goal',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

interface NutrientChartProps {
  data: {
    nutrient: string;
    goal: number;
    consumed: number;
  }[];
}

export function NutrientChart({ data }: NutrientChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="nutrient"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis />
        <Tooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="consumed" fill="var(--color-consumed)" radius={4} />
        <Bar dataKey="goal" fill="var(--color-goal)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
