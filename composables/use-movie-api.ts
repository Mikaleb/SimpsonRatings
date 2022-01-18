import { reactive, SetupContext, toRefs } from "@nuxtjs/composition-api";
import { globalState } from "~/types/State";

interface Options {
  ctx: SetupContext;
  apiSelected: string;
  tvShowId: any;
}

export default function useMovieApi({
  ctx,
  apiSelected = "TMDB",
  tvShowId = "456-the-simpsons"
}: Options) {
  // Setting up the endpoint with TMDB for now
  const endpoint: string =
    apiSelected === "TMDB" ? "https://api.themoviedb.org/3/tv/" : "";

  const apiState: any = reactive({
    response: [],
    error: null,
    fetching: false
  });

  const globalState: any = reactive({
    showDetails: {},
    maxNbEpisodesPerSeason: 0,
    seasons: {}
  });

  const loadShowInfos = async () => {
    const url = apiSelected === "TMDB" ? endpoint + tvShowId : endpoint;
    apiState.fetching = true;
    const { data } = await ctx.root.$axios.get(url, {
      params: {
        api_key: apiSelected === "TMDB" ? process.env.NUXT_ENV_TMDB_API : null
      }
    });
    globalState.showDetails = data;
    await setSeasonRatings(data.number_of_seasons);
    await getMaxNbEpisodesPerSeason();
    apiState.fetching = false;
  };

  // Loading ratings array in the form of [ {seasonNb: 1, vote_avg: 7.3, seasonData: {...infos}}]
  const setSeasonRatings = async (numberOfSeasons = 31) => {
    const seasons = [];
    for (let seasonNb = 1; seasonNb <= numberOfSeasons; seasonNb++) {
      const seasonData = await getSeasonData(seasonNb);
      const votesAvg = seasonData.episodes.map(
        (episode: any) => episode.vote_average
      );
      seasons.push({ ...seasonData, votesAvg });
    }
    globalState.seasons = seasons;
  };

  const getSeasonData = async (seasonNb: number) => {
    const url =
      apiSelected === "TMDB"
        ? endpoint + tvShowId + "/season/" + seasonNb
        : endpoint;
    const { data } = await ctx.root.$axios.get(url, {
      params: {
        api_key: apiSelected === "TMDB" ? process.env.NUXT_ENV_TMDB_API : null
      }
    });
    return data;
  };

  const getMaxNbEpisodesPerSeason = async () => {
    if (globalState.seasons) {
      globalState.maxNbEpisodesPerSeason = globalState.seasons
        .map((season: any) => season.episodes)
        .map((episodes: any) => episodes.length)
        .reduce((max: any, val: any) => {
          return max > val ? max : val;
        });
    }
  };

  const getEpisodeInfos = async (seasonNb: number, episodeNb: number) => {
    console.log("tvShowId", tvShowId);
    if (seasonNb && episodeNb) {
      const url =
        apiSelected === "TMDB"
          ? endpoint +
            tvShowId +
            "/season/" +
            seasonNb +
            "/episode/" +
            episodeNb
          : endpoint;
      const { data } = await ctx.root.$axios.get(url, {
        params: {
          api_key: apiSelected === "TMDB" ? process.env.NUXT_ENV_TMDB_API : null
        }
      });
      return data;
    }
  };

  return {
    ...toRefs(apiState),
    ...toRefs(globalState),
    getEpisodeInfos,
    loadShowInfos,
    getSeasonData
  };
}
