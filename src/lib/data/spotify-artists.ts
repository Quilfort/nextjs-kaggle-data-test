import { getSpotify2023Tracks } from "@/lib/data/spotify-2023-reader";
import { getSpotify2024Tracks } from "@/lib/data/spotify-2024-reader";

export type ArtistStats = {
  name: string;
  streams2023: number;
  streams2024: number;
  total: number;
};

export type ArtistTrackStats = {
  name: string;
  streams2023: number;
  streams2024: number;
  total: number;
};

export type ArtistDetails = {
  name: string;
  streams2023: number;
  streams2024: number;
  total: number;
  tracks: ArtistTrackStats[];
};

/**
 * Normalizes artist names so that comparisons are consistent.
 *
 * Handles:
 * - Uppercase and lowercase differences
 * - Accented characters
 * - Multiple spaces
 * - Non-breaking spaces and other whitespace
 * - Invisible Unicode characters
 */
function normalizeName(name: string): string {
  return name
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
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

function getArtistMap(): Map<string, ArtistStats> {
  const artists = new Map<string, ArtistStats>();

  function getOrCreateArtist(name: string): ArtistStats | undefined {
    const cleanName = name.trim();

    if (!cleanName) {
      return undefined;
    }

    const key = normalizeName(cleanName);
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

  const tracks2023 = getSpotify2023Tracks();
  const tracks2024 = getSpotify2024Tracks();

  // 2023: artistName can contain multiple comma-separated artists.
  for (const track of tracks2023) {
    const streams = parseStreams(track.streams);

    for (const artistName of splitArtists(track.artistName)) {
      const artist = getOrCreateArtist(artistName);

      if (artist) {
        artist.streams2023 += streams;
      }
    }
  }

  // 2024: only the artist field is used.
  for (const track of tracks2024) {
    const streams = parseStreams(track.spotifyStreams);

    for (const artistName of splitArtists(track.artist)) {
      const artist = getOrCreateArtist(artistName);

      if (artist) {
        artist.streams2024 += streams;
      }
    }
  }

  for (const artist of artists.values()) {
    artist.total = artist.streams2023 + artist.streams2024;
  }

  return artists;
}

export function getAllArtists(): ArtistStats[] {
  return Array.from(getArtistMap().values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

export function getTopArtists(limit = 25): ArtistStats[] {
  return getAllArtists()
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function getArtistDetails(name: string): ArtistDetails | null {
  const artistKey = normalizeName(name);
  const artist = getArtistMap().get(artistKey);

  if (!artist) {
    return null;
  }

  const tracks = new Map<string, ArtistTrackStats>();

  function addTrack(
    trackName: string | null | undefined,
    streams: number,
    year: 2023 | 2024,
  ) {
    const cleanName = trackName?.trim();

    if (!cleanName) {
      return;
    }

    const key = normalizeName(cleanName);
    const existing = tracks.get(key);

    if (existing) {
      if (year === 2023) {
        existing.streams2023 += streams;
      } else {
        existing.streams2024 += streams;
      }

      existing.total = existing.streams2023 + existing.streams2024;
      return;
    }

    tracks.set(key, {
      name: cleanName,
      streams2023: year === 2023 ? streams : 0,
      streams2024: year === 2024 ? streams : 0,
      total: streams,
    });
  }

  // Collect this artist's tracks from 2023.
  for (const track of getSpotify2023Tracks()) {
    const trackArtists = splitArtists(track.artistName);

    const belongsToArtist = trackArtists.some(
      (trackArtist) => normalizeName(trackArtist) === artistKey,
    );

    if (belongsToArtist) {
      addTrack(track.trackName, parseStreams(track.streams), 2023);
    }
  }

  // Collect this artist's tracks from 2024.
  // Featured artists in the track title are intentionally ignored.
  for (const track of getSpotify2024Tracks()) {
    const trackArtists = splitArtists(track.artist);

    const belongsToArtist = trackArtists.some(
      (trackArtist) => normalizeName(trackArtist) === artistKey,
    );

    if (belongsToArtist) {
      addTrack(track.trackName, parseStreams(track.spotifyStreams), 2024);
    }
  }

  const artistTracks = Array.from(tracks.values()).sort(
    (a, b) => b.total - a.total || a.name.localeCompare(b.name),
  );

  return {
    name: artist.name,
    streams2023: artist.streams2023,
    streams2024: artist.streams2024,
    total: artist.total,
    tracks: artistTracks,
  };
}
