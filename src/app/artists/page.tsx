import { Music2, Search, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import {
  SpotifyArtistsTable,
  type ArtistStats,
} from "@/components/dashboard/spotify-artists-table";

import { getSpotify2023Tracks } from "@/lib/data/spotify-2023-reader";
import { getSpotify2024Tracks } from "@/lib/data/spotify-2024-reader";

function normalizeArtistName(name: string): string {
  return name.trim().toLowerCase();
}

function parseStreams(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(/,/g, "").trim());
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function splitArtists(value: string | null | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((artist) => artist.trim())
    .filter(Boolean);
}

function formatStreams(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function getTopArtists(): ArtistStats[] {
  const tracks2023 = getSpotify2023Tracks();
  const tracks2024 = getSpotify2024Tracks();

  const artists = new Map<string, ArtistStats>();

  function getOrCreateArtist(name: string): ArtistStats | undefined {
    const cleanName = name.trim();

    if (!cleanName) {
      return undefined;
    }

    const key = normalizeArtistName(cleanName);
    const existing = artists.get(key);

    if (existing) {
      return existing;
    }

    const artist: ArtistStats = {
      name: cleanName,
      streams2023: 0,
      streams2024: 0,
      total: 0,
    };

    artists.set(key, artist);

    return artist;
  }

  // Spotify 2023: split comma-separated artist names.
  for (const track of tracks2023) {
    const streams = parseStreams(track.streams);
    const trackArtists = splitArtists(track.artistName);

    for (const artistName of trackArtists) {
      const artist = getOrCreateArtist(artistName);

      if (artist) {
        artist.streams2023 += streams;
      }
    }
  }

  // Spotify 2024: only use the artist field.
  for (const track of tracks2024) {
    const streams = parseStreams(track.spotifyStreams);
    const trackArtists = splitArtists(track.artist);

    for (const artistName of trackArtists) {
      const artist = getOrCreateArtist(artistName);

      if (artist) {
        artist.streams2024 += streams;
      }
    }
  }

  return Array.from(artists.values())
    .map((artist) => ({
      ...artist,
      total: artist.streams2023 + artist.streams2024,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, 25);
}

export default function ArtistsPage() {
  const topArtists = getTopArtists();

  const totalArtists = topArtists.length;

  const combinedStreams = topArtists.reduce(
    (total, artist) => total + artist.total,
    0,
  );

  return (
    <main className="min-w-0 flex-1 space-y-8 p-6 lg:p-8">
      {/* Page heading */}
      <section className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>Spotify Data Explorer</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Artists</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Discover the most streamed artists across the 2023 and 2024
            datasets.
          </p>
        </div>
      </section>

      {/* Search bar - functionality will be added later */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <div
          className="flex h-12 items-center rounded-xl border border-border/60 bg-card pl-11 pr-4 text-sm text-muted-foreground"
          aria-label="Search artists"
        >
          Search artists...
        </div>
      </div>

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Artists in ranking
              </p>

              <p className="text-2xl font-semibold tabular-nums">
                {totalArtists}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Music2 className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">
                Combined streams · Top 25
              </p>

              <p
                className="text-2xl font-semibold tabular-nums"
                title={combinedStreams.toLocaleString("en-US")}
              >
                {formatStreams(combinedStreams)}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Artists table */}
      <SpotifyArtistsTable artists={topArtists} />
    </main>
  );
}
