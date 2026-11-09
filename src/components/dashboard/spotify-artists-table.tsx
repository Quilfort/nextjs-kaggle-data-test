import { ArrowUpDown, Music2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { ArtistStats } from "@/lib/data/spotify-artists";

type SpotifyArtistsTableProps = {
  artists: ArtistStats[];
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

export function SpotifyArtistsTable({ artists }: SpotifyArtistsTableProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col gap-2 border-b border-border/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Top 25 Artists</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Ranked by combined Spotify streams from 2023 and 2024.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowUpDown className="size-3.5" />
            <span>Sorted by total streams</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="w-16 px-5 py-4 text-right font-medium">#</th>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 text-right font-medium">2023</th>
                <th className="px-5 py-4 text-right font-medium">2024</th>
                <th className="bg-primary/[0.04] px-5 py-4 text-right font-semibold text-foreground">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {artists.map((artist, index) => (
                <tr
                  key={artist.name.toLowerCase()}
                  className="border-b border-border/40 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-4 text-right tabular-nums text-muted-foreground">
                    {index + 1}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Music2 className="size-4" />
                      </div>
                      <span className="font-medium">{artist.name}</span>
                    </div>
                  </td>

                  <td
                    className="px-5 py-4 text-right tabular-nums text-muted-foreground"
                    title={formatFullStreams(artist.streams2023)}
                  >
                    {formatStreams(artist.streams2023)}
                  </td>

                  <td
                    className="px-5 py-4 text-right tabular-nums text-muted-foreground"
                    title={formatFullStreams(artist.streams2024)}
                  >
                    {formatStreams(artist.streams2024)}
                  </td>

                  <td
                    className="bg-primary/[0.04] px-5 py-4 text-right font-semibold tabular-nums text-primary"
                    title={formatFullStreams(artist.total)}
                  >
                    {formatStreams(artist.total)}
                  </td>
                </tr>
              ))}

              {artists.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    No artist data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/60 px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Artist streams are calculated by assigning the full track stream
            count to every artist listed in the dataset.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
