import type { ElementType } from "react";

import {
  Activity,
  ChartNoAxesCombined,
  Disc3,
  Music2,
  Radio,
  Users,
  Video,
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

import { Spotify2024OverviewCharts } from "@/components/dashboard/spotify-2024-overview-charts";
import { getSpotify2024Tracks } from "@/lib/data/spotify-2024-reader";

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

function getReleaseYear(releaseDate: string | null): number | null {
  if (!releaseDate) {
    return null;
  }

  const normalizedDate = releaseDate.trim();

  // ISO format: YYYY-MM-DD
  const isoMatch = normalizedDate.match(/^(\d{4})-\d{1,2}-\d{1,2}$/);

  if (isoMatch) {
    const year = Number(isoMatch[1]);

    return year >= 1900 && year <= 2099 ? year : null;
  }

  // CSV format: M/D/YYYY or MM/DD/YYYY
  const usDateMatch = normalizedDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

  if (usDateMatch) {
    const month = Number(usDateMatch[1]);
    const day = Number(usDateMatch[2]);
    const year = Number(usDateMatch[3]);

    const parsedDate = new Date(Date.UTC(year, month - 1, day));

    const isValidDate =
      parsedDate.getUTCFullYear() === year &&
      parsedDate.getUTCMonth() === month - 1 &&
      parsedDate.getUTCDate() === day;

    if (!isValidDate || year < 1900 || year > 2099) {
      return null;
    }

    return year;
  }

  return null;
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

export default function Spotify2024Page() {
  const tracks = getSpotify2024Tracks();

  // General statistics
  const totalTracks = tracks.length;

  const totalSpotifyStreams = tracks.reduce(
    (sum, track) => sum + (track.spotifyStreams ?? 0),
    0,
  );

  const averageTrackScore = calculateAverage(
    tracks.map((track) => track.trackScore),
  );

  const averageSpotifyPopularity = calculateAverage(
    tracks.map((track) => track.spotifyPopularity),
  );

  // Explicit track statistics
  const tracksWithExplicitValue = tracks.filter(
    (track) => track.explicitTrack !== null,
  );

  const explicitTracks = tracksWithExplicitValue.filter(
    (track) => track.explicitTrack === true,
  ).length;

  const explicitPercentage =
    tracksWithExplicitValue.length > 0
      ? (explicitTracks / tracksWithExplicitValue.length) * 100
      : null;

  // Unique artists
  const uniqueArtists = new Set(
    tracks
      .flatMap((track) => (track.artist ?? "").split(","))
      .map((artist) => artist.trim().toLowerCase())
      .filter(Boolean),
  ).size;

  // Top 10 tracks by Spotify streams
  const topTracks = tracks
    .filter(
      (track): track is typeof track & { spotifyStreams: number } =>
        track.spotifyStreams !== null && Number.isFinite(track.spotifyStreams),
    )
    .sort((a, b) => b.spotifyStreams - a.spotifyStreams)
    .slice(0, 10)
    .map((track) => ({
      trackName: track.trackName || "Unknown track",
      artist: track.artist || "Unknown artist",
      streams: track.spotifyStreams,
    }));

  // Top 10 tracks by TikTok posts
  const topTikTokTracks = tracks
    .filter(
      (track): track is typeof track & { tiktokPosts: number } =>
        track.tiktokPosts !== null && Number.isFinite(track.tiktokPosts),
    )
    .sort((a, b) => b.tiktokPosts - a.tiktokPosts)
    .slice(0, 10)
    .map((track) => ({
      trackName: track.trackName || "Unknown track",
      artist: track.artist || "Unknown artist",
      posts: track.tiktokPosts,
    }));

  // Tracks released per year
  const releaseYearCounts = new Map<number, number>();

  for (const track of tracks) {
    const year = getReleaseYear(track.releaseDate);

    if (year === null) {
      continue;
    }

    releaseYearCounts.set(year, (releaseYearCounts.get(year) ?? 0) + 1);
  }

  const tracksByYear = Array.from(releaseYearCounts.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, count]) => ({
      year: String(year),
      tracks: count,
    }));

  // Explicit vs non-explicit distribution
  const nonExplicitTracks = tracksWithExplicitValue.length - explicitTracks;

  const explicitDistribution = [
    {
      category: "Explicit",
      tracks: explicitTracks,
    },
    {
      category: "Not explicit",
      tracks: nonExplicitTracks,
    },
  ];

  // YouTube and TikTok views
  const totalYouTubeViews = tracks.reduce(
    (sum, track) => sum + (track.youtubeViews ?? 0),
    0,
  );

  const totalTikTokViews = tracks.reduce(
    (sum, track) => sum + (track.tiktokViews ?? 0),
    0,
  );

  const platformViews = [
    {
      platform: "YouTube",
      views: totalYouTubeViews,
    },
    {
      platform: "TikTok",
      views: totalTikTokViews,
    },
  ];

  // Spotify streams grouped by original release year
  const streamsByYearMap = new Map<number, number>();

  for (const track of tracks) {
    const year = getReleaseYear(track.releaseDate);
    const streams = track.spotifyStreams;

    if (year === null || streams === null || !Number.isFinite(streams)) {
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
          <span>2024</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Spotify 2024 Overview
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Explore streaming performance, platform reach, track popularity and
            cross-platform engagement from the 2024 dataset.
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
          value={formatStreams(totalSpotifyStreams)}
          description="Combined Spotify streams across all tracks"
          icon={Activity}
        />

        <StatCard
          title="Average Track Score"
          value={
            averageTrackScore === null ? "N/A" : averageTrackScore.toFixed(1)
          }
          description="Average score in the dataset"
          icon={ChartNoAxesCombined}
        />

        <StatCard
          title="Spotify Popularity"
          value={
            averageSpotifyPopularity === null
              ? "N/A"
              : averageSpotifyPopularity.toFixed(1)
          }
          description="Average Spotify popularity score"
          icon={Disc3}
        />

        <StatCard
          title="Explicit Tracks"
          value={formatPercentage(explicitPercentage)}
          description={`${formatCompactNumber(explicitTracks)} explicit tracks with a known value`}
          icon={Radio}
        />

        <StatCard
          title="Unique Artists"
          value={formatCompactNumber(uniqueArtists)}
          description="Based on artist names in the dataset"
          icon={Users}
        />
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Dataset Insights
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            A closer look at streaming performance, release history and platform
            engagement.
          </p>
        </div>

        <Spotify2024OverviewCharts
          topTracks={topTracks}
          topTikTokTracks={topTikTokTracks}
          tracksByYear={tracksByYear}
          explicitDistribution={explicitDistribution}
          platformViews={platformViews}
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
                  <TableHead className="text-right">Spotify Streams</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {topTracks.map((track, index) => (
                  <TableRow key={`${track.trackName}-${track.artist}`}>
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
                        title={track.artist}
                      >
                        {track.artist}
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
        <Video className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

        <p className="text-xs leading-relaxed text-muted-foreground">
          Statistics are calculated directly from the local Spotify 2024 CSV
          file. Missing values are excluded from calculations that require them.
          Platform totals represent the sum of the available values for the
          tracks in this dataset; they should not be interpreted as unique users
          or unique listeners.
        </p>
      </div>
    </main>
  );
}
