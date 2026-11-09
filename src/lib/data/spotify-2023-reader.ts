import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import type { SpotifyTrack2023 } from "./spotify-2023-types";

const CSV_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "2023",
  "spotify-2023.csv",
);

const REQUIRED_COLUMNS = [
  "track_name",
  "artist(s)_name",
  "artist_count",
  "released_year",
  "released_month",
  "released_day",
  "in_spotify_playlists",
  "in_spotify_charts",
  "streams",
  "in_apple_playlists",
  "in_apple_charts",
  "in_deezer_playlists",
  "in_deezer_charts",
  "in_shazam_charts",
  "bpm",
  "key",
  "mode",
  "danceability_%",
  "valence_%",
  "energy_%",
  "acousticness_%",
  "instrumentalness_%",
  "liveness_%",
  "speechiness_%",
];

type CsvRecord = Record<string, string>;

function parseNumber(value: string | undefined): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  // Remove thousands separators before converting.
  const normalizedValue = value.trim().replace(/,/g, "");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseString(value: string | undefined): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function mapRecord(record: CsvRecord): SpotifyTrack2023 {
  return {
    trackName: record["track_name"]?.trim() ?? "",
    artistName: record["artist(s)_name"]?.trim() ?? "",
    artistCount: parseNumber(record["artist_count"]),

    releasedYear: parseNumber(record["released_year"]),
    releasedMonth: parseNumber(record["released_month"]),
    releasedDay: parseNumber(record["released_day"]),

    inSpotifyPlaylists: parseNumber(record["in_spotify_playlists"]),
    inSpotifyCharts: parseNumber(record["in_spotify_charts"]),
    streams: parseNumber(record["streams"]),

    inApplePlaylists: parseNumber(record["in_apple_playlists"]),
    inAppleCharts: parseNumber(record["in_apple_charts"]),

    inDeezerPlaylists: parseNumber(record["in_deezer_playlists"]),
    inDeezerCharts: parseNumber(record["in_deezer_charts"]),

    inShazamCharts: parseNumber(record["in_shazam_charts"]),

    bpm: parseNumber(record["bpm"]),
    key: parseString(record["key"]),
    mode: parseString(record["mode"]),

    danceability: parseNumber(record["danceability_%"]),
    valence: parseNumber(record["valence_%"]),
    energy: parseNumber(record["energy_%"]),
    acousticness: parseNumber(record["acousticness_%"]),
    instrumentalness: parseNumber(record["instrumentalness_%"]),
    liveness: parseNumber(record["liveness_%"]),
    speechiness: parseNumber(record["speechiness_%"]),
  };
}

export function getSpotify2023Tracks(): SpotifyTrack2023[] {
  let csvContent: string;

  try {
    csvContent = readFileSync(CSV_PATH, "utf-8");
  } catch {
    throw new Error(`Could not read Spotify 2023 CSV file: ${CSV_PATH}`);
  }

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  }) as CsvRecord[];

  if (records.length === 0) {
    return [];
  }

  const availableColumns = Object.keys(records[0]);

  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !availableColumns.includes(column),
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Spotify 2023 CSV is missing columns: ${missingColumns.join(", ")}`,
    );
  }

  return records.map(mapRecord);
}
