<template>
  <div class="flex flex-col">
    <div class="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div
        class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg"
      >
        <v-simple-table
          dense
          fixed-header
          class="min-w-full"
          :loading="loading"
        >
          <thead>
            <tr>
              <template v-for="header in headers">
                <head-cell :key="header.value" :data="header"></head-cell>
              </template>
            </tr>
          </thead>
          <tbody v-if="cSeasons">
            <template v-for="(ratings, key) in episodesRatings">
              <tr :key="key" :id="key">
                <th>{{ ratings.episodeNb + 1 }}</th>
                <template v-for="episodes in ratings">
                  <template v-for="(episode, season) in episodes">
                    <cell
                      v-if="season !== 'episodeNb'"
                      :key="episode.id"
                      :data="episode"
                      :index="season"
                      :episodeNb="ratings.episodeNb + 1"
                      :pTvShowId="cTvShowId"
                    ></cell>
                  </template>
                </template>
              </tr>
            </template>
          </tbody>
        </v-simple-table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  computed,
  ref,
} from '@nuxtjs/composition-api'
import HeadCell from '~/components/Table/HeadCell.vue'
import Cell from '~/components/Table/Cell.vue'
import useMovieApi from '@/composables/use-movie-api'

export default defineComponent({
  name: 'tableBase',
  components: {
    HeadCell,
    Cell,
  },
  props: {
    seasons: {
      default: [],
    },
    maxNbEpisodesPerSeason: {
      default: 0,
    },
    tvShowId: {
      default: '',
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const cSeasons = computed(() => props.seasons)
    const cTvShowId = computed(() => props.tvShowId)
    const cMaxEpisodesNb = computed(() => props.maxNbEpisodesPerSeason)
    const apiSelected = process.env.API_CHOICE ? process.env.API_CHOICE : 'TMDB'

    let loading: boolean = false

    const headers: any = [
      {
        text: 'Episode',
        align: 'start',
        sortable: false,
        value: 'episodeNb',
      },
    ]

    const setHeaders = () => {
      cSeasons.value.map((season: any) => {
        headers.push({
          text: season.season_number,
          value: season.season_number.toString(),
          sortable: true,
          ...season,
        })
      })
    }

    // For each episode number, we set all the ratings of each season
    // Because v-table can't do otherwise
    const setRatingsPerEpisodeNb = () => {
      loading = true
      const episodesObj: any = []
      // ex : [{episodeNb : 0}, {episodeNb: 1}]
      for (
        let episodeNb = 0;
        episodeNb <= props.maxNbEpisodesPerSeason;
        episodeNb++
      ) {
        episodesObj.push({ episodeNb })

        // Set all votes of episodes for a season
        cSeasons.value.map((season: any) => {
          // If the season episodes contain the episode number, add it to the episode Nb array
          episodesObj[episodeNb][season.season_number] = season.episodes.filter(
            (episode: any) => episode.episode_number === episodeNb + 1
          )
        })
      }

      loading = false
      return episodesObj
    }

    const getColor = (rating: number) => {
      if (rating === null) {
        return null
      }
      if (rating === 0) {
        return 'bg-gray-500'
      }
      // from 0 to 5 : very bad
      // 5 to 6 : bad
      // 6 to 6.5 : mid
      // 6.5 to 7.5: okay
      // 7.5 to 8 : good
      // above 8 : excellent
      
      if (rating < 5) {
        return 'bg-red-700'
      }
      if (rating < 6) {
        return 'bg-red-600'
      }
      if (rating < 6.5) {
        return 'bg-orange-500'
      }
      if (rating < 7.5) {
        return 'bg-yellow-500'
      }
      if (rating < 8) {
        return 'bg-green-500'
      }
      if (rating >= 8) {
        return 'bg-green-400'
      }
    }

    setHeaders()
    const episodesRatings = setRatingsPerEpisodeNb()

    return {
      getColor,
      headers,
      episodesRatings,
      loading,
      cSeasons,
      cTvShowId,
    }
  },
})
</script>
