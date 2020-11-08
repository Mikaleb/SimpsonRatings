// import { TvShowDetails } from '@/types/tv-show-details'

export interface apiState {
  response: [];
  error?: any;
  fetching: boolean;
}

export interface globalState {
  showDetails?: any | null;
  seasons?: any;
  maxNbEpisodesPerSeason?: number;
  ratings?: any;
}
