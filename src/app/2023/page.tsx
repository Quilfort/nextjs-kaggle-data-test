import type { ElementType } from "react";

import {
  Activity,
  AudioLines,
  Disc3,
  ListMusic,
  Music2,
  Radio,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Spotify2023OverviewCharts } from "@/components/dashboard/spotify-2023-overview-charts";
import { getSpotify2023Tracks } from "@/lib/data/spotify-2023-reader";

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatStreams(value: number): string {
  if (value >= 1_000_000_000_000) {
    return `${(value / 1_000_000_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  }

  return formatCompactNumber(value);
}

function formatPercentage(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${value.toFixed(1)}%`;
}

function calculateAverage(values: (number | null)[]): number | null {
  const validValues = values.filter(
    (value): value is number => value !== null && Number.isFinite(value),
  );

  if (validValues.length === 0) {
    return null;
  }

  const total = validValues.reduce((sum, value) => sum + value, 0);

  return total / validValues.length;
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ElementType<{ className?: string }>;
}) {
  return (
    <Card className="border-border/60 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-sm font-medium">
          {title}
        </CardDescription>

        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-4" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </div>

        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Spotify2023Page() {
  const tracks = getSpotify2023Tracks();

  // General statistics
  const totalTracks = tracks.length;

  const totalStreams = tracks.reduce(
    (sum, track) => sum + (track.streams ?? 0),
    0,
  );

  const averageBpm = calculateAverage(tracks.map((track) => track.bpm));

  const averageDanceability = calculateAverage(
    tracks.map((track) => track.danceability),
  );

  const totalSpotifyPlaylistEntries = tracks.reduce(
    (sum, track) => sum + (track.inSpotifyPlaylists ?? 0),
    0,
  );

  // Count unique artists.
  // The CSV stores multiple artists in one comma-separated field.
  const uniqueArtists = new Set(
    tracks
      .flatMap((track) => track.artistName.split(","))
      .map((artist) => artist.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  // Top 10 tracks by Spotify streams
  const topTracks = tracks
    .filter(
      (track): track is typeof track & { streams: number } =>
        track.streams !== null && Number.isFinite(track.streams),
    )
    .sort((a, b) => b.streams - a.streams)
    .slice(0, 10)
    .map((track) => ({
      trackName: track.trackName || "Unknown track",
      artistName: track.artistName || "Unknown artist",
      streams: track.streams,
    }));

  // Tracks released by decade
  const decadeCounts = new Map<number, number>();

  for (const track of tracks) {
    const year = track.releasedYear;

    if (
      year === null ||
      !Number.isInteger(year) ||
      year < 1900 ||
      year > 2099
    ) {
      continue;
    }

    const decade = Math.floor(year / 10) * 10;

    decadeCounts.set(decade, (decadeCounts.get(decade) ?? 0) + 1);
  }

  const tracksByDecade = Array.from(decadeCounts.entries())
    .sort(([a], [b]) => a - b)
    .map(([decade, count]) => ({
      decade: `${decade}s`,
      tracks: count,
    }));

  // Musical mode distribution: Major vs Minor
  const modeCounts = new Map<string, number>([
    ["Major", 0],
    ["Minor", 0],
  ]);

  for (const track of tracks) {
    const normalizedMode = track.mode?.trim().toLowerCase();

    if (normalizedMode === "major") {
      modeCounts.set("Major", (modeCounts.get("Major") ?? 0) + 1);
    }

    if (normalizedMode === "minor") {
      modeCounts.set("Minor", (modeCounts.get("Minor") ?? 0) + 1);
    }
  }

  const musicalModeDistribution = [
    {
      mode: "Major",
      tracks: modeCounts.get("Major") ?? 0,
    },
    {
      mode: "Minor",
      tracks: modeCounts.get("Minor") ?? 0,
    },
  ];

  // Average audio features
  const audioFeatureDefinitions = [
    {
      feature: "Danceability",
      values: tracks.map((track) => track.danceability),
    },
    {
      feature: "Energy",
      values: tracks.map((track) => track.energy),
    },
    {
      feature: "Valence",
      values: tracks.map((track) => track.valence),
    },
    {
      feature: "Acousticness",
      values: tracks.map((track) => track.acousticness),
    },
    {
      feature: "Instrumentalness",
      values: tracks.map((track) => track.instrumentalness),
    },
    {
      feature: "Liveness",
      values: tracks.map((track) => track.liveness),
    },
    {
      feature: "Speechiness",
      values: tracks.map((track) => track.speechiness),
    },
  ];

  const audioFeatures = audioFeatureDefinitions.map((definition) => ({
    feature: definition.feature,
    average: calculateAverage(definition.values) ?? 0,
  }));

  // BPM distribution
  const bpmRanges = [
    { range: "< 90", min: 0, max: 89 },
    { range: "90–109", min: 90, max: 109 },
    { range: "110–129", min: 110, max: 129 },
    { range: "130–149", min: 130, max: 149 },
    { range: "150+", min: 150, max: Number.POSITIVE_INFINITY },
  ];

  const bpmDistribution = bpmRanges.map((bpmRange) => ({
    range: bpmRange.range,
    tracks: tracks.filter((track) => {
      const bpm = track.bpm;

      return bpm !== null && bpm >= bpmRange.min && bpm <= bpmRange.max;
    }).length,
  }));

  // Spotify streams grouped by original release year
  const streamsByYearMap = new Map<number, number>();

  for (const track of tracks) {
    const year = track.releasedYear;
    const streams = track.streams;

    if (
      year === null ||
      streams === null ||
      !Number.isInteger(year) ||
      !Number.isFinite(streams)
    ) {
      continue;
    }

    streamsByYearMap.set(year, (streamsByYearMap.get(year) ?? 0) + streams);
  }

  const streamsByYear = Array.from(streamsByYearMap.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, streams]) => ({
      year: String(year),
      streams,
    }));

  return (
    <main className="min-w-0 flex-1 space-y-8 p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Music2 className="size-4" />
          <span>Spotify Data Explorer</span>
          <span>/</span>
          <span>2023</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Spotify 2023 Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Explore track performance, release history, musical characteristics
            and streaming statistics from the 2023 dataset.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Tracks"
          value={formatCompactNumber(totalTracks)}
          description="Tracks included in the dataset"
          icon={Music2}
        />

        <StatCard
          title="Total Spotify Streams"
          value={formatStreams(totalStreams)}
          description="Combined streams across all tracks"
          icon={Activity}
        />

        <StatCard
          title="Unique Artists"
          value={formatCompactNumber(uniqueArtists)}
          description="Based on the artist names in the dataset"
          icon={Users}
        />

        <StatCard
          title="Average BPM"
          value={averageBpm === null ? "N/A" : averageBpm.toFixed(0)}
          description="Average beats per minute"
          icon={AudioLines}
        />

        <StatCard
          title="Average Danceability"
          value={formatPercentage(averageDanceability)}
          description="Average danceability score"
          icon={Disc3}
        />

        <StatCard
          title="Spotify Playlist Entries"
          value={formatCompactNumber(totalSpotifyPlaylistEntries)}
          description="Combined Spotify playlist placements"
          icon={ListMusic}
        />
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Dataset Insights
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A closer look at track popularity, release history and musical
            characteristics.
          </p>
        </div>

        <Spotify2023OverviewCharts
          topTracks={topTracks}
          tracksByDecade={tracksByDecade}
          musicalModeDistribution={musicalModeDistribution}
          audioFeatures={audioFeatures}
          bpmDistribution={bpmDistribution}
          streamsByYear={streamsByYear}
        />
      </section>

      {/* Top 10 table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Most Streamed Tracks
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The 10 tracks with the highest Spotify stream counts.
          </p>
        </div>

        <Card className="border-border/60 bg-card">
          <CardHeader>
            <CardTitle className="text-base">Top 10 Tracks</CardTitle>

            <CardDescription>Ranked by total Spotify streams.</CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead className="text-right">Streams</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {topTracks.map((track, index) => (
                  <TableRow key={`${track.trackName}-${track.artistName}`}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <span
                        className="block max-w-[280px] truncate font-medium"
                        title={track.trackName}
                      >
                        {track.trackName}
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className="block max-w-[220px] truncate text-muted-foreground"
                        title={track.artistName}
                      >
                        {track.artistName}
                      </span>
                    </TableCell>

                    <TableCell className="text-right font-medium tabular-nums">
                      {formatStreams(track.streams)}
                    </TableCell>
                  </TableRow>
                ))}

                {topTracks.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No track data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Dataset note */}
      <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-4">
        <Radio className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-relaxed text-muted-foreground">
          Statistics are calculated directly from the local Spotify 2023 CSV
          file. Tracks with missing values are excluded from calculations that
          require those values. Stream totals represent the sum of the stream
          counts in the dataset, not unique listeners.
        </p>
      </div>
    </main>
  );
}
