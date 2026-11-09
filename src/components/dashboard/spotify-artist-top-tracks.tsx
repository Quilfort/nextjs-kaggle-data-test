import { Music2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { ArtistTrackStats } from "@/lib/data/spotify-artists";

type SpotifyArtistTopTracksProps = {
  tracks: ArtistTrackStats[];
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

export function SpotifyArtistTopTracks({
  tracks,
}: SpotifyArtistTopTracksProps) {
  const topTracks = tracks.slice(0, 10);

  return (
    <Card className="overflow-hidden border-border/60 bg-card">
      <CardContent className="p-0">
        <div className="border-b border-border/60 p-5">
          <h2 className="text-lg font-semibold">Top 10 Tracks</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            The most streamed tracks by this artist across both datasets.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="w-16 px-5 py-4 text-right font-medium">#</th>

                <th className="px-5 py-4 font-medium">Track</th>

                <th className="px-5 py-4 text-right font-medium">2023</th>

                <th className="px-5 py-4 text-right font-medium">2024</th>

                <th className="bg-primary/[0.04] px-5 py-4 text-right font-semibold text-foreground">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {topTracks.map((track, index) => (
                <tr
                  key={track.name.toLowerCase()}
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

                      <span className="font-medium">{track.name}</span>
                    </div>
                  </td>

                  <td
                    className="px-5 py-4 text-right tabular-nums text-muted-foreground"
                    title={formatFullStreams(track.streams2023)}
                  >
                    {formatStreams(track.streams2023)}
                  </td>

                  <td
                    className="px-5 py-4 text-right tabular-nums text-muted-foreground"
                    title={formatFullStreams(track.streams2024)}
                  >
                    {formatStreams(track.streams2024)}
                  </td>

                  <td
                    className="bg-primary/[0.04] px-5 py-4 text-right font-semibold tabular-nums text-primary"
                    title={formatFullStreams(track.total)}
                  >
                    {formatStreams(track.total)}
                  </td>
                </tr>
              ))}

              {topTracks.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-muted-foreground"
                  >
                    No tracks found for this artist.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border/60 px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {topTracks.length} of {tracks.length} tracks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
