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

import { Spotify2023Chart } from "@/components/dashboard/spotify-2023-chart";
import { getSpotify2023Tracks } from "@/lib/data/spotify-2023-reader";

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatStreams(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${(value / 1_000_000_000).toFixed(2)}B`;
}

export default function Spotify2023Page() {
  const tracks = getSpotify2023Tracks();

  const tracksWithStreams = tracks.filter((track) => track.streams !== null);

  const sortedTracks = [...tracksWithStreams].sort(
    (a, b) => (b.streams ?? 0) - (a.streams ?? 0),
  );

  const topTracks = sortedTracks.slice(0, 10);

  const totalStreams = tracksWithStreams.reduce(
    (total, track) => total + (track.streams ?? 0),
    0,
  );

  const tracksWithBpm = tracks.filter((track) => track.bpm !== null);

  const averageBpm =
    tracksWithBpm.length > 0
      ? Math.round(
          tracksWithBpm.reduce((total, track) => total + (track.bpm ?? 0), 0) /
            tracksWithBpm.length,
        )
      : 0;

  const chartData = topTracks.map((track) => ({
    trackName: track.trackName,
    streams: track.streams ?? 0,
  }));

  if (tracks.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Spotify 2023</h1>
        <p className="mt-2 text-muted-foreground">
          No tracks were found in the CSV file.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            DATA EXPLORER / 2023
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Spotify 2023
          </h1>

          <p className="mt-2 text-muted-foreground">
            Overview of the most streamed Spotify tracks in 2023.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total tracks</CardDescription>
              <CardTitle className="text-3xl">
                {formatNumber(tracks.length)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tracks loaded from CSV
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total streams</CardDescription>
              <CardTitle className="text-3xl">
                {formatStreams(totalStreams)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Combined streams across valid records
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Average BPM</CardDescription>
              <CardTitle className="text-3xl">{averageBpm || "N/A"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Average tempo of available records
              </p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 most streamed tracks</CardTitle>
            <CardDescription>Ranked by total Spotify streams.</CardDescription>
          </CardHeader>

          <CardContent>
            <Spotify2023Chart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 tracks</CardTitle>
            <CardDescription>
              The ten tracks with the highest stream counts.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Track</TableHead>
                  <TableHead>Artist</TableHead>
                  <TableHead className="text-right">Streams</TableHead>
                  <TableHead className="text-right">BPM</TableHead>
                  <TableHead className="text-right">Danceability</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {topTracks.map((track, index) => (
                  <TableRow key={`${track.trackName}-${index}`}>
                    <TableCell className="font-medium">
                      {track.trackName}
                    </TableCell>

                    <TableCell>{track.artistName}</TableCell>

                    <TableCell className="text-right">
                      {formatStreams(track.streams)}
                    </TableCell>

                    <TableCell className="text-right">
                      {track.bpm ?? "N/A"}
                    </TableCell>

                    <TableCell className="text-right">
                      {track.danceability !== null
                        ? `${track.danceability}%`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
