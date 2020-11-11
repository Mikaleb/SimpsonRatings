<template>
  <div v-if="cData" class="p-5 mt-5">
    <v-card elevation="1">
      <v-img
        class="black--text align-end"
        height="500"
        gradient="to right,
    rgba(252, 240, 8, 0.95) 150px,
    rgba(100%, 83.53%, 11.76%, 0.84) 100%"
        v-if="cData.backdrop_path"
        :src="'https://image.tmdb.org/t/p/original' + cData.backdrop_path"
      >
        <div class="flex-no-wrap d-flex justify-space-between">
          <v-row no-gutters>
            <v-col cols="4" sm="4">
              <v-img
                v-if="cData.poster_path"
                contain
                max-height="500"
                :src="'https://image.tmdb.org/t/p/w500/' + cData.poster_path"
              ></v-img>
            </v-col>
            <v-col cols="8">
              <v-card-title class="headline">
                <b class="pr-2">{{ cData.name }}</b> ({{
                  new Date(cData.first_air_date).getFullYear()
                }})
              </v-card-title>

              <v-card-subtitle>
                <span v-for="genre in cData.genres" :key="genre.id">
                  {{ genre.name }}
                </span>
                -
                <span v-for="(runtime, id) in cData.episode_run_time" :key="id"
                  >{{ runtime }}mn</span
                >
              </v-card-subtitle>

              <v-card-text>
                <h2 class="title">Overview</h2>
                <p>{{ cData.overview }}</p>
              </v-card-text>

              <!-- <v-card-actions>
                <v-btn class="mt-5 ml-2" outlined rounded small> </v-btn>
              </v-card-actions> -->
            </v-col>
          </v-row>
        </div>
      </v-img>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

import useMovieApi from '@/composables/use-movie-api'
import About from '~/components/About.vue'

export default defineComponent({
  name: 'ShowResume',
  components: {},
  props: {
    data: {
      default: {},
    },
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

    const cData = computed(() => props.data)

    return {
      cData,
    }
  },
})
</script>

<style scoped>
</style>
