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
  artist: string;
  streams: number;
};

type TikTokTrackChartData = {
  trackName: string;
  artist: string;
  posts: number;
};

type ReleaseYearData = {
  year: string;
  tracks: number;
};

type ExplicitData = {
  category: string;
  tracks: number;
};

type PlatformViewsData = {
  platform: string;
  views: number;
};

type StreamsByYearData = {
  year: string;
  streams: number;
};

type Spotify2024OverviewChartsProps = {
  topTracks: TrackChartData[];
  topTikTokTracks: TikTokTrackChartData[];
  tracksByYear: ReleaseYearData[];
  explicitDistribution: ExplicitData[];
  platformViews: PlatformViewsData[];
  streamsByYear: StreamsByYearData[];
};

const streamsConfig = {
  streams: {
    label: "Streams",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const tiktokPostsConfig = {
  posts: {
    label: "TikTok Posts",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const releaseConfig = {
  tracks: {
    label: "Tracks",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const explicitConfig = {
  tracks: {
    label: "Tracks",
  },
} satisfies ChartConfig;

const viewsConfig = {
  views: {
    label: "Views",
    color: "var(--chart-3)",
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

export function Spotify2024OverviewCharts({
  topTracks,
  topTikTokTracks,
  tracksByYear,
  explicitDistribution,
  platformViews,
  streamsByYear,
}: Spotify2024OverviewChartsProps) {
  const explicitColors: Record<string, string> = {
    Explicit: "var(--chart-1)",
    "Not explicit": "var(--chart-3)",
  };

  return (
    <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
      {/* Top 10 tracks by Spotify streams */}
      <ChartSection
        title="Top 10 Tracks"
        description="The most streamed tracks in the 2024 dataset."
      >
        <ChartContainer config={streamsConfig} className="h-[340px] w-full">
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

      {/* Tracks released per year */}
      <ChartSection
        title="Tracks Released per Year"
        description="Number of tracks grouped by their original release year."
      >
        <ChartContainer config={releaseConfig} className="h-[340px] w-full">
          <LineChart
            accessibilityLayer
            data={tracksByYear}
            margin={{ left: 8, right: 16, top: 12 }}
          >
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

      {/* Explicit distribution */}
      <ChartSection
        title="Explicit vs. Non-explicit Tracks"
        description="Distribution of tracks based on their explicit content flag."
      >
        <div className="flex h-[340px] flex-col items-center justify-center">
          <ChartContainer
            config={explicitConfig}
            className="h-[250px] w-full max-w-[340px]"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={<ChartTooltipContent nameKey="category" hideLabel />}
              />

              <Pie
                data={explicitDistribution}
                dataKey="tracks"
                nameKey="category"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                strokeWidth={3}
                stroke="var(--card)"
              >
                {explicitDistribution.map((entry) => (
                  <Cell
                    key={entry.category}
                    fill={explicitColors[entry.category] ?? "var(--chart-5)"}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="flex flex-wrap items-center justify-center gap-6">
            {explicitDistribution.map((entry) => (
              <div key={entry.category} className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      explicitColors[entry.category] ?? "var(--chart-5)",
                  }}
                />

                <span className="text-sm text-muted-foreground">
                  {entry.category}
                </span>

                <span className="text-sm font-semibold tabular-nums">
                  {formatCompactNumber(entry.tracks)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartSection>

      {/* Platform views */}
      <ChartSection
        title="Platform Views"
        description="Combined YouTube and TikTok views across the tracks."
      >
        <ChartContainer config={viewsConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={platformViews}
            margin={{ left: 8, right: 16, top: 12 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="platform"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={formatCompactNumber}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatCompactNumber(Number(value))}
                />
              }
            />

            <Bar
              dataKey="views"
              fill="var(--color-views)"
              radius={[5, 5, 0, 0]}
              barSize={52}
            />
          </BarChart>
        </ChartContainer>
      </ChartSection>

      {/* Spotify streams by release year */}
      <ChartSection
        title="Spotify Streams by Release Year"
        description="Combined Spotify streams grouped by the original release year."
      >
        <ChartContainer config={streamsConfig} className="h-[340px] w-full">
          <AreaChart
            accessibilityLayer
            data={streamsByYear}
            margin={{ left: 8, right: 16, top: 12 }}
          >
            <defs>
              <linearGradient
                id="spotify2024StreamsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
              fill="url(#spotify2024StreamsGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </ChartSection>

      {/* Top 10 tracks by TikTok posts */}
      <ChartSection
        title="Top 10 Tracks by TikTok Posts"
        description="Tracks ranked by the number of TikTok posts using each track."
      >
        <ChartContainer config={tiktokPostsConfig} className="h-[340px] w-full">
          <BarChart
            accessibilityLayer
            data={topTikTokTracks}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />

            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatCompactNumber}
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
                  formatter={(value) => formatCompactNumber(Number(value))}
                />
              }
            />

            <Bar
              dataKey="posts"
              fill="var(--color-posts)"
              radius={[0, 5, 5, 0]}
              barSize={19}
            />
          </BarChart>
        </ChartContainer>
      </ChartSection>
    </div>
  );
}
