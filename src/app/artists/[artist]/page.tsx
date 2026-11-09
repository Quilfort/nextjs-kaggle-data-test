import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Music2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { SpotifyArtistTopTracks } from "@/components/dashboard/spotify-artist-top-tracks";
import { getArtistDetails } from "@/lib/data/spotify-artists";

type ArtistPageProps = {
  params: Promise<{
    artist: string;
  }>;
};

function formatStreams(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatFullStreams(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { artist: encodedArtistName } = await params;

  let artistName: string;

  try {
    artistName = decodeURIComponent(encodedArtistName);
  } catch {
    notFound();
  }

  const artist = getArtistDetails(artistName);

  if (!artist) {
    notFound();
  }

  return (
    <main className="min-w-0 flex-1 space-y-8 p-6 lg:p-8">
      <Link
        href="/artists"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to artists
      </Link>

      <section className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4" />
          <span>Artist overview</span>
        </div>

        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {artist.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Spotify performance across the 2023 and 2024 datasets.
          </p>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/30 bg-primary/[0.04] sm:col-span-1">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Music2 className="size-5" />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">
                Total Spotify streams
              </p>

              <p
                className="text-2xl font-semibold tabular-nums text-primary"
                title={formatFullStreams(artist.total)}
              >
                {formatStreams(artist.total)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">2023 streams</p>

            <p
              className="mt-2 text-2xl font-semibold tabular-nums"
              title={formatFullStreams(artist.streams2023)}
            >
              {formatStreams(artist.streams2023)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">2024 streams</p>

            <p
              className="mt-2 text-2xl font-semibold tabular-nums"
              title={formatFullStreams(artist.streams2024)}
            >
              {formatStreams(artist.streams2024)}
            </p>
          </CardContent>
        </Card>
      </section>

      <SpotifyArtistTopTracks tracks={artist.tracks} />
    </main>
  );
}
