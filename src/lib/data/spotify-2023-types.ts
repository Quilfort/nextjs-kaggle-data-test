export type SpotifyTrack2023 = {
  trackName: string;
  artistName: string;
  artistCount: number | null;

  releasedYear: number | null;
  releasedMonth: number | null;
  releasedDay: number | null;

  inSpotifyPlaylists: number | null;
  inSpotifyCharts: number | null;
  streams: number | null;

  inApplePlaylists: number | null;
  inAppleCharts: number | null;

  inDeezerPlaylists: number | null;
  inDeezerCharts: number | null;

  inShazamCharts: number | null;

  bpm: number | null;
  key: string | null;
  mode: string | null;

  danceability: number | null;
  valence: number | null;
  energy: number | null;
  acousticness: number | null;
  instrumentalness: number | null;
  liveness: number | null;
  speechiness: number | null;
};
