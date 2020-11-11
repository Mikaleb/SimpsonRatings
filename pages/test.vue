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
              <ShowResume
                :data="showDetails"
                gradient="to right, rgba(3.14%, 14.51%, 40.39%, 1.00) 150px, rgba(7.06%, 20.39%, 50.59%, 0.84) 100%"
              />
            </div>
          </v-col>
          <v-col cols="6">
            <div>
              <h2 class="title">
                Episodes ratings heatmap
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon color="primary" dark v-bind="attrs" v-on="on">
                      mdi-help-circle-outline
                    </v-icon>
                  </template>
                  <span>
                    <p>
                      Seasons are on the horizontal axis ->
                      <br />Episodes are on the vertical axis ↓
                    </p>
                  </span>
                </v-tooltip>
              </h2>
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
                :tvShowId="tvShowId"
              />
            </div>
            <div v-else>
              <v-progress-circular indeterminate color="primary" />
            </div>
          </v-col>
        </v-row>
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
    const tvShowId = '82856-the-mandalorian'

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
    } = useMovieApi({ ctx, apiSelected, tvShowId })

    onMounted(async () => {
      await loadShowInfos() // fetch main product
    })

    return {
      showDetails, // easy to forget if we remove useProduct
      maxNbEpisodesPerSeason,
      seasons,
      tvShowId,
    }
  },
})
</script>
