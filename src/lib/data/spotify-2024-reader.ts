import { readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";

import type { SpotifyTrack2024 } from "./spotify-2024-types";

const CSV_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "2024",
  "spotify-2024.csv",
);

const REQUIRED_COLUMNS = [
  "Track",
  "Album Name",
  "Artist",
  "Release Date",
  "ISRC",
  "All Time Rank",
  "Track Score",
  "Spotify Streams",
  "Spotify Playlist Count",
  "Spotify Playlist Reach",
  "Spotify Popularity",
  "YouTube Views",
  "YouTube Likes",
  "TikTok Posts",
  "TikTok Likes",
  "TikTok Views",
  "YouTube Playlist Reach",
  "Apple Music Playlist Count",
  "AirPlay Spins",
  "SiriusXM Spins",
  "Deezer Playlist Count",
  "Deezer Playlist Reach",
  "Amazon Playlist Count",
  "Pandora Streams",
  "Pandora Track Stations",
  "Soundcloud Streams",
  "Shazam Counts",
  "TIDAL Popularity",
  "Explicit Track",
];

type CsvRecord = Record<string, string>;

function parseNumber(value: string | undefined): number | null {
  if (!value || value.trim() === "") {
    return null;
  }

  const normalizedValue = value.trim().replace(/,/g, "");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function parseString(value: string | undefined): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

function parseBoolean(value: string | undefined): boolean | null {
  const normalizedValue = value?.trim().toLowerCase();

  if (!normalizedValue) {
    return null;
  }

  if (["true", "1", "yes"].includes(normalizedValue)) {
    return true;
  }

  if (["false", "0", "no"].includes(normalizedValue)) {
    return false;
  }

  return null;
}

function mapRecord(record: CsvRecord): SpotifyTrack2024 {
  return {
    trackName: parseString(record["Track"]),
    albumName: parseString(record["Album Name"]),
    artist: parseString(record["Artist"]),
    releaseDate: parseString(record["Release Date"]),
    isrc: parseString(record["ISRC"]),
    allTimeRank: parseNumber(record["All Time Rank"]),
    trackScore: parseNumber(record["Track Score"]),
    spotifyStreams: parseNumber(record["Spotify Streams"]),
    spotifyPlaylistCount: parseNumber(record["Spotify Playlist Count"]),
    spotifyPlaylistReach: parseNumber(record["Spotify Playlist Reach"]),
    spotifyPopularity: parseNumber(record["Spotify Popularity"]),
    youtubeViews: parseNumber(record["YouTube Views"]),
    youtubeLikes: parseNumber(record["YouTube Likes"]),
    tiktokPosts: parseNumber(record["TikTok Posts"]),
    tiktokLikes: parseNumber(record["TikTok Likes"]),
    tiktokViews: parseNumber(record["TikTok Views"]),
    youtubePlaylistReach: parseNumber(record["YouTube Playlist Reach"]),
    appleMusicPlaylistCount: parseNumber(record["Apple Music Playlist Count"]),
    airplaySpins: parseNumber(record["AirPlay Spins"]),
    siriusXmSpins: parseNumber(record["SiriusXM Spins"]),
    deezerPlaylistCount: parseNumber(record["Deezer Playlist Count"]),
    deezerPlaylistReach: parseNumber(record["Deezer Playlist Reach"]),
    amazonPlaylistCount: parseNumber(record["Amazon Playlist Count"]),
    pandoraStreams: parseNumber(record["Pandora Streams"]),
    pandoraTrackStations: parseNumber(record["Pandora Track Stations"]),
    soundcloudStreams: parseNumber(record["Soundcloud Streams"]),
    shazamCounts: parseNumber(record["Shazam Counts"]),
    tidalPopularity: parseNumber(record["TIDAL Popularity"]),
    explicitTrack: parseBoolean(record["Explicit Track"]),
  };
}

export function getSpotify2024Tracks(): SpotifyTrack2024[] {
  let csvContent: string;

  try {
    csvContent = readFileSync(CSV_PATH, "utf-8");
  } catch {
    throw new Error(`Could not read Spotify 2024 CSV file: ${CSV_PATH}`);
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
      `Spotify 2024 CSV is missing columns: ${missingColumns.join(", ")}`,
    );
  }

  return records.map(mapRecord);
}
