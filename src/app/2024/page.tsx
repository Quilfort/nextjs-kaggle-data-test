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

import { getSpotify2024Tracks } from "@/lib/data/spotify-2024-reader";

function formatNumber(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US").format(value);
}

export default function Spotify2024Page() {
  const tracks = getSpotify2024Tracks();
  const previewTracks = tracks.slice(0, 5);

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            DATA IMPORT / 2024
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Spotify 2024
          </h1>

          <p className="mt-2 text-muted-foreground">
            Preview of the imported Spotify 2024 dataset.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardDescription>Imported tracks</CardDescription>
            <CardTitle className="text-3xl">
              {formatNumber(tracks.length)}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total number of records loaded from the CSV file.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data preview</CardTitle>
            <CardDescription>
              The first five records from the 2024 dataset.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {tracks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No tracks were found in the CSV file.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead className="text-right">
                      Spotify Streams
                    </TableHead>
                    <TableHead className="text-right">Explicit</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {previewTracks.map((track, index) => (
                    <TableRow key={`${track.isrc ?? track.trackName}-${index}`}>
                      <TableCell className="font-medium">
                        {track.trackName ?? "N/A"}
                      </TableCell>

                      <TableCell>{track.artist ?? "N/A"}</TableCell>

                      <TableCell>{track.releaseDate ?? "N/A"}</TableCell>

                      <TableCell className="text-right">
                        {formatNumber(track.spotifyStreams)}
                      </TableCell>

                      <TableCell className="text-right">
                        {track.explicitTrack === null
                          ? "N/A"
                          : track.explicitTrack
                            ? "Yes"
                            : "No"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
