import Link from "next/link";

import {
  Activity,
  ArrowRight,
  AudioWaveform,
  ChartNoAxesCombined,
  Disc3,
  Music2,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { getSpotify2023Tracks } from "@/lib/data/spotify-2023-reader";
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

function getUniqueArtists(artistNames: (string | null)[]): number {
  const artists = new Set<string>();

  for (const artistName of artistNames) {
    if (!artistName) {
      continue;
    }

    const individualArtists = artistName.split(",");

    for (const artist of individualArtists) {
      const normalizedArtist = artist.trim().toLowerCase();

      if (normalizedArtist) {
        artists.add(normalizedArtist);
      }
    }
  }

  return artists.size;
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
  icon: React.ElementType;
}) {
  return (
    <Card className="group relative overflow-hidden border-border/60 bg-card transition-colors hover:border-primary/40">
      <CardContent className="flex items-start justify-between p-5">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>

          <div>
            <p className="text-3xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function DatasetCard({
  title,
  description,
  href,
  icon: Icon,
  year,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  year: string;
  accent: string;
}) {
  return (
    <Link href={href} className="group block">
      <Card className="relative h-full overflow-hidden border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
        <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />

        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between">
            <div className="rounded-xl border border-border/60 bg-muted/40 p-3 transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
              <Icon className="size-6 text-primary" />
            </div>

            <Badge variant="outline" className="font-mono text-xs">
              {year}
            </Badge>
          </div>

          <div className="mt-6 flex-1">
            <h3 className="text-xl font-semibold tracking-tight">{title}</h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
            <span className="text-sm font-medium text-primary">
              Explore dataset
            </span>

            <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function HomePage() {
  const tracks2023 = getSpotify2023Tracks();
  const tracks2024 = getSpotify2024Tracks();

  const totalTracks = tracks2023.length + tracks2024.length;

  const totalStreams2023 = tracks2023.reduce(
    (sum, track) => sum + (track.streams ?? 0),
    0,
  );

  const totalStreams2024 = tracks2024.reduce(
    (sum, track) => sum + (track.spotifyStreams ?? 0),
    0,
  );

  const totalStreams = totalStreams2023 + totalStreams2024;

  const uniqueArtists = getUniqueArtists([
    ...tracks2023.map((track) => track.artistName),
    ...tracks2024.map((track) => track.artist),
  ]);

  return (
    <main className="min-w-0 flex-1 space-y-10 p-6 lg:p-8">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-2xl border border-border/60 bg-card">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -right-24 -top-32 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 left-1/3 size-80 rounded-full bg-primary/5 blur-3xl" />

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />
        </div>

        <div className="relative flex flex-col justify-between gap-10 p-7 sm:p-10 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-5 gap-2 border-primary/30 bg-primary/5 px-3 py-1 text-primary"
            >
              <span className="size-1.5 rounded-full bg-primary" />
              SPOTIFY DATA EXPLORER
            </Badge>

            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Your music data,
              <span className="block text-primary">explored.</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Explore streaming trends, discover popular tracks and dive into
              music statistics. Take a closer look at the data behind the music.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <Music2 className="size-4 text-primary" />
                Two datasets
              </span>

              <span className="text-border">/</span>

              <span className="flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                Streaming insights
              </span>

              <span className="text-border">/</span>

              <span className="flex items-center gap-2">
                <Users className="size-4 text-primary" />
                Artist statistics
              </span>
            </div>
          </div>

          {/* Decorative audio visual */}
          <div
            aria-hidden="true"
            className="hidden shrink-0 items-center justify-center lg:flex"
          >
            <div className="relative flex size-56 items-center justify-center rounded-full border border-primary/15 bg-primary/[0.03]">
              <div className="absolute size-40 rounded-full border border-primary/20" />

              <div className="absolute size-28 rounded-full border border-primary/25" />

              <div className="flex items-center gap-1.5">
                {[20, 38, 58, 34, 72, 46, 64, 30, 52, 24].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="w-1.5 rounded-full bg-primary"
                      style={{
                        height: `${height}px`,
                        opacity: 0.45 + (height / 72) * 0.55,
                      }}
                    />
                  ),
                )}
              </div>

              <div className="absolute bottom-5 right-5 rounded-full border border-primary/20 bg-card p-3 text-primary shadow-lg">
                <AudioWaveform className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Your music at a glance
          </h2>

          <p className="text-sm text-muted-foreground">
            An overview of the combined 2023 and 2024 datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Total Tracks"
            value={formatCompactNumber(totalTracks)}
            description="Tracks across both datasets"
            icon={Music2}
          />

          <StatCard
            title="Total Spotify Streams"
            value={formatStreams(totalStreams)}
            description="Combined streams from both datasets"
            icon={ChartNoAxesCombined}
          />

          <StatCard
            title="Unique Artists"
            value={formatCompactNumber(uniqueArtists)}
            description="Unique artist names across both datasets"
            icon={Users}
          />
        </div>
      </section>

      {/* Dataset navigation */}
      <section className="space-y-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Explore datasets
          </h2>

          <p className="text-sm text-muted-foreground">
            Choose a dataset to explore its tracks, statistics and insights.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DatasetCard
            title="Spotify 2023"
            description="Explore track performance, musical characteristics, streaming records and release trends."
            href="/2023"
            icon={Disc3}
            year="2023"
            accent="bg-chart-2"
          />

          <DatasetCard
            title="Spotify 2024"
            description="Discover streaming performance, platform engagement, track popularity and release history."
            href="/2024"
            icon={ChartNoAxesCombined}
            year="2024"
            accent="bg-primary"
          />

          <DatasetCard
            title="Artists"
            description="Explore artists and discover their tracks, streaming performance and musical statistics."
            href="/artists"
            icon={Users}
            year="ARTISTS"
            accent="bg-chart-3"
          />
        </div>
      </section>

      {/* Footer note */}
      <footer className="flex flex-col gap-2 border-t border-border/60 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Spotify Data Explorer</p>

        <p>Statistics are calculated from the local CSV datasets.</p>
      </footer>
    </main>
  );
}
