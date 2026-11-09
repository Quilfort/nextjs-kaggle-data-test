"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const chartData = [
  { track: "Track A", streams: 2100 },
  { track: "Track B", streams: 1800 },
  { track: "Track C", streams: 1500 },
  { track: "Track D", streams: 1200 },
  { track: "Track E", streams: 900 },
  { track: "Track F", streams: 750 },
];

const chartConfig = {
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              DATA EXPLORER
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Spotify Analytics
            </h1>

            <p className="mt-2 text-muted-foreground">
              Explore streaming trends and music statistics.
            </p>
          </div>

          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh demo
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Tracks analysed</CardDescription>
              <CardTitle className="text-3xl">953</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Example value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Top track streams</CardDescription>
              <CardTitle className="text-3xl">2.10B</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Example value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Datasets</CardDescription>
              <CardTitle className="text-3xl">2023 / 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Two datasets planned
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Top tracks by streams</CardTitle>
            <CardDescription>
              Illustrative data · Streams in millions
            </CardDescription>
          </CardHeader>

          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[300px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  top: 12,
                  right: 12,
                  bottom: 4,
                  left: 0,
                }}
              >
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="track"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: number) =>
                    `${(value / 1000).toFixed(1)}B`
                  }
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Bar dataKey="streams" fill="var(--color-streams)" radius={6} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Spotify Analytics · Next.js + shadcn/ui
        </p>
      </div>
    </main>
  );
}
