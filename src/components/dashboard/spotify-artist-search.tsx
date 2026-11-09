"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, UserRound, X } from "lucide-react";

type SpotifyArtistSearchProps = {
  artists: string[];
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array<number>(b.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[a.length][b.length];
}

function getMatchRank(artist: string, query: string): number | null {
  const normalizedArtist = normalize(artist);

  if (normalizedArtist === query) {
    return 0;
  }

  if (normalizedArtist.startsWith(query)) {
    return 1;
  }

  if (normalizedArtist.includes(query)) {
    return 2;
  }

  if (query.length >= 5) {
    const words = normalizedArtist.split(/[\s-]+/);
    const candidates = [normalizedArtist, ...words];
    const maxDistance = query.length >= 8 ? 2 : 1;

    const hasCloseMatch = candidates.some(
      (candidate) =>
        Math.abs(candidate.length - query.length) <= maxDistance &&
        levenshteinDistance(candidate, query) <= maxDistance,
    );

    if (hasCloseMatch) {
      return 3;
    }
  }

  return null;
}

export function SpotifyArtistSearch({ artists }: SpotifyArtistSearchProps) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const normalizedQuery = normalize(query);

  const suggestions = useMemo(() => {
    if (normalizedQuery.length < 3) {
      return [];
    }

    return artists
      .map((artist) => ({
        name: artist,
        rank: getMatchRank(artist, normalizedQuery),
      }))
      .filter(
        (result): result is { name: string; rank: number } =>
          result.rank !== null,
      )
      .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
      .slice(0, 10);
  }, [artists, normalizedQuery]);

  function selectArtist(name: string) {
    setQuery(name);
    setIsOpen(false);

    router.push(`/artists/${encodeURIComponent(name)}`);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        current < suggestions.length - 1 ? current + 1 : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        current > 0 ? current - 1 : suggestions.length - 1,
      );
    }

    if (event.key === "Enter") {
      event.preventDefault();

      selectArtist(suggestions[activeIndex].name);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="relative z-20">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            window.setTimeout(() => setIsOpen(false), 150);
          }}
          placeholder="Search for an artist..."
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && normalizedQuery.length >= 3}
          aria-controls="artist-search-results"
          aria-autocomplete="list"
          className="h-12 w-full rounded-xl border border-border/60 bg-card pl-11 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/10"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {isOpen && normalizedQuery.length > 0 && (
        <div
          id="artist-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl"
        >
          {normalizedQuery.length < 3 ? (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              Enter at least 3 characters to search.
            </p>
          ) : suggestions.length > 0 ? (
            <>
              <div className="border-b border-border/50 px-4 py-2">
                <p className="text-xs text-muted-foreground">
                  {suggestions.length} matching artists
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto p-1">
                {suggestions.map((artist, index) => (
                  <button
                    key={artist.name}
                    type="button"
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectArtist(artist.name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                      activeIndex === index
                        ? "bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <UserRound className="size-4" />
                    </div>

                    <span className="font-medium">{artist.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="px-4 py-4 text-sm text-muted-foreground">
              No artists found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
