"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type ChartData = {
  trackName: string;
  streams: number;
};

type Spotify2023ChartProps = {
  data: ChartData[];
};

const chartConfig = {
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function Spotify2023Chart({ data }: Spotify2023ChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 12,
          right: 12,
          bottom: 8,
          left: 12,
        }}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="trackName"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={65}
          tick={{ fontSize: 11 }}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value: number) =>
            `${(value / 1_000_000_000).toFixed(1)}B`
          }
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

        <Bar dataKey="streams" fill="var(--color-streams)" radius={6} />
      </BarChart>
    </ChartContainer>
  );
}
