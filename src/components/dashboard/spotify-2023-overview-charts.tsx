"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type TrackChartData = {
  trackName: string;
  artistName: string;
  streams: number;
};

type DecadeChartData = {
  decade: string;
  tracks: number;
};

type ModeChartData = {
  mode: string;
  tracks: number;
};

type AudioFeatureData = {
  feature: string;
  average: number;
};

type BpmChartData = {
  range: string;
  tracks: number;
};

type StreamsChartData = {
  year: string;
  streams: number;
};

type Spotify2023OverviewChartsProps = {
  topTracks: TrackChartData[];
  tracksByDecade: DecadeChartData[];
  musicalModeDistribution: ModeChartData[];
  audioFeatures: AudioFeatureData[];
  bpmDistribution: BpmChartData[];
  streamsByYear: StreamsChartData[];
};

const topTracksConfig = {
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const decadeConfig = {
  tracks: {
    label: "Tracks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const modeConfig = {
  Major: {
    label: "Major",
    color: "var(--chart-1)",
  },
  Minor: {
    label: "Minor",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const audioConfig = {
  average: {
    label: "Average",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const bpmConfig = {
  tracks: {
    label: "Tracks",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const streamsConfig = {
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatStreams(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(1)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }

  return formatCompactNumber(value);
}

function ChartSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border/60 bg-card p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {children}
    </section>
  );
}

export function Spotify2023OverviewCharts({
  topTracks,
  tracksByDecade,
  musicalModeDistribution,
  audioFeatures,
  bpmDistribution,
  streamsByYear,
}: Spotify2023OverviewChartsProps) {
  const modeColors: Record<string, string> = {
    Major: "var(--color-Major)",
    Minor: "var(--color-Minor)",
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Top 10 tracks */}
      <ChartSection
        title="Top 10 Tracks"
        description="The most streamed tracks in the 2023 dataset."
      >
        <ChartContainer config={topTracksConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={topTracks}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatStreams}
            />

            <YAxis
              type="category"
              dataKey="trackName"
              width={125}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(value: string) =>
                value.length > 18 ? `${value.slice(0, 18)}...` : value
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatStreams(Number(value))}
                />
              }
            />

            <Bar
              dataKey="streams"
              fill="var(--color-streams)"
              radius={[0, 5, 5, 0]}
              barSize={19}
            />
          </BarChart>
        </ChartContainer>
      </ChartSection>

      {/* Tracks released by decade */}
      <ChartSection
        title="Tracks Released by Decade"
        description="How the release years of tracks in the dataset are distributed across decades."
      >
        <ChartContainer config={decadeConfig} className="h-[340px] w-full">
          <LineChart
            accessibilityLayer
            data={tracksByDecade}
            margin={{ left: 8, right: 16, top: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="decade"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDecimals={false}
              tickFormatter={formatCompactNumber}
            />

            <ChartTooltip content={<ChartTooltipContent />} />

            <Line
              type="monotone"
              dataKey="tracks"
              stroke="var(--color-tracks)"
              strokeWidth={2.5}
              dot={{
                fill: "var(--color-tracks)",
                strokeWidth: 0,
                r: 4,
              }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </ChartSection>

      {/* Musical mode distribution */}
      <ChartSection
        title="Musical Mode Distribution"
        description="The distribution of tracks in Major and Minor keys."
      >
        <div className="flex h-[340px] flex-col items-center justify-center">
          <ChartContainer
            config={modeConfig}
            className="h-[250px] w-full max-w-[340px]"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="mode" hideLabel />}
              />

              <Pie
                data={musicalModeDistribution}
                dataKey="tracks"
                nameKey="mode"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                strokeWidth={3}
                stroke="var(--card)"
              >
                {musicalModeDistribution.map((entry) => (
                  <Cell
                    key={entry.mode}
                    fill={modeColors[entry.mode] ?? "var(--chart-5)"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {musicalModeDistribution.map((entry) => (
              <div key={entry.mode} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: modeColors[entry.mode] ?? "var(--chart-5)",
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.mode}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCompactNumber(entry.tracks)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartSection>

      {/* Average audio features */}
      <ChartSection
        title="Average Audio Features"
        description="Average audio characteristics across all tracks, measured as percentages."
      >
        <ChartContainer config={audioConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={audioFeatures}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}%`}
            />

            <YAxis
              type="category"
              dataKey="feature"
              width={115}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
              }
            />

            <Bar
              dataKey="average"
              fill="var(--color-average)"
              radius={[0, 5, 5, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </ChartSection>

      {/* Streams by release year */}
      <ChartSection
        title="Streams by Release Year"
        description="Combined Spotify streams grouped by the original release year."
      >
        <ChartContainer config={streamsConfig} className="h-[340px] w-full">
          <AreaChart
            accessibilityLayer
            data={streamsByYear}
            margin={{ left: 8, right: 16, top: 12 }}
          >
            <defs>
              <linearGradient id="streamsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-streams)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-streams)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
              minTickGap={24}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatStreams}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => formatStreams(Number(value))}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="streams"
              stroke="var(--color-streams)"
              strokeWidth={2}
              fill="url(#streamsGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </ChartSection>

      {/* BPM distribution */}
      <ChartSection
        title="BPM Distribution"
        description="Number of tracks grouped by tempo range."
      >
        <ChartContainer config={bpmConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={bpmDistribution}
            margin={{ left: 8, right: 16, top: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tickFormatter={formatCompactNumber}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Bar
              dataKey="tracks"
              fill="var(--color-tracks)"
              radius={[5, 5, 0, 0]}
              barSize={38}
            />
          </BarChart>
        </ChartContainer>
      </ChartSection>
    </div>
  );
}
