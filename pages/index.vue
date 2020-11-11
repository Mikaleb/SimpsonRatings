<template>
  <v-app>
    <v-main>
      <div class="w-full px-2">
        <div v-if="!showDetails">
          <v-progress-circular indeterminate color="primary" />
        </div>
        <v-row no-gutters>
          <v-col cols="12" sm="12">
            <div v-if="showDetails" class="pb-4">
              <ShowResume :data="showDetails" />
              <div class="text-lg" v-if="showDetails">
                {{ showDetails.original_name }}
              </div>
              <div v-if="showDetails">
                {{ showDetails.number_of_seasons }} Seasons
              </div>
              <div v-if="showDetails">
                {{ showDetails.number_of_episodes }} Episodes
              </div>
            </div>
          </v-col>
          <v-col cols="6">
            <div>
              <p>
                Seasons are on the horizontal axis ->
                <br />Episodes are on the vertical axis ↓
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="12">
            <div
              v-if="seasons.length && showDetails && maxNbEpisodesPerSeason"
              class="w-full px-4"
            >
              <TableBase
                :seasons="seasons"
                :max-nb-episodes-per-season="maxNbEpisodesPerSeason"
              />
            </div>
            <div v-else>
              <v-progress-circular indeterminate color="primary" />
            </div>
          </v-col>
          <!-- <v-col cols="12" sm="12">
              <show-infos />
            </v-col>-->
        </v-row>
        <br />
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {
  defineComponent,
  Ref,
  reactive,
  onMounted,
} from '@nuxtjs/composition-api'

import TableBase from '~/components/Table/Base.vue'
import ShowResume from '~/components/ShowResume.vue'
import useMovieApi from '@/composables/use-movie-api'

export default defineComponent({
  name: 'Index',
  components: {
    TableBase,
    ShowResume,
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const apiSelected = process.env.API_CHOICE ? process.env.API_CHOICE : 'TMDB'
    const {
      //@ts-ignore
      showDetails, // easy to forget if we remove useProduct
      //@ts-ignore
      seasons,
      //@ts-ignore
      maxNbEpisodesPerSeason,
      //@ts-ignore
      ratings,
      loadShowInfos,
    } = useMovieApi({ ctx, apiSelected })

    onMounted(async () => {
      await loadShowInfos() // fetch main product
    })

    return {
      showDetails, // easy to forget if we remove useProduct
      maxNbEpisodesPerSeason,
      seasons,
    }
  },
})
</script>
