import { Music2, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { SpotifyArtistSearch } from "@/components/dashboard/spotify-artist-search";
import { SpotifyArtistsTable } from "@/components/dashboard/spotify-artists-table";

import { getAllArtists, getTopArtists } from "@/lib/data/spotify-artists";

function formatStreams(value: number): string {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ArtistsPage() {
  const allArtists = getAllArtists();
  const topArtists = getTopArtists(25);

  const combinedStreams = topArtists.reduce(
    (total, artist) => total + artist.total,
    0,
  );

  return (
    <main className="min-w-0 flex-1 space-y-8 p-6 lg:p-8">
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

      {/* Artist search */}
      <SpotifyArtistSearch artists={allArtists.map((artist) => artist.name)} />

      {/* Overview */}
      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="border-border/60 bg-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total artists</p>

              <p className="text-2xl font-semibold tabular-nums">
                {allArtists.length.toLocaleString("en-US")}
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

      <SpotifyArtistsTable artists={topArtists} />
    </main>
  );
}
