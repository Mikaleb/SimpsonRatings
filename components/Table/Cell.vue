<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ dialog }">
      <td
        v-if="cellData.vote_average === null"
        class="p-1 text-gray-900 whitespace-no-wrap"
        @click="toggleDialog()"
      ></td>
      <td
        v-else
        class="p-1 text-gray-900 whitespace-no-wrap"
        :class="
          cellData.vote_average !== undefined
            ? getColor(cellData.vote_average)
            : ''
        "
        @click="toggleDialog()"
      >
        {{
          cellData.vote_average !== undefined
            ? cellData.vote_average.toFixed(1)
            : ''
        }}
      </td>
    </template>

    <v-card v-if="episodeData">
      <v-img
        height="250"
        :src="'https://image.tmdb.org/t/p/w500/' + episodeData.still_path"
      ></v-img>

      <v-card-title class="headline grey">
        {{ episodeData.name }}
      </v-card-title>

      <div class="p-2 ml-4 grey--text">
        S{{ episodeData.season_number }}E{{ episodeData.episode_number }}
      </div>
      <div class="p-2 ml-4">
        <v-rating
          hover
          length="10"
          size="16"
          :value="episodeData.vote_average"
        ></v-rating>
      </div>

      <v-card-text>
        {{ episodeData.overview }}
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  computed,
} from '@nuxtjs/composition-api'
import useMovieApi from '@/composables/use-movie-api'

export default defineComponent({
  name: 'Cell',
  props: {
    data: {
      default: null,
    },
    index: {
      default: null,
    },
    episodeNb: {
      default: 0,
    },
    pTvShowId: {
      default: '',
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx) {
    const apiSelected = process.env.API_CHOICE ? process.env.API_CHOICE : 'TMDB'

    const tvShowId = ref<any>(props.pTvShowId)
    const cellData = ref<any>(props.data)
    const episodeData = ref<any>(null)
    let apiData = reactive({})

    let dialog = ref<boolean>(false)
    let tvShowIdData = tvShowId.value

    const toggleDialog = async () => {
      const { getEpisodeInfos } = useMovieApi({
        ctx,
        apiSelected,
        tvShowId: tvShowIdData,
      })

      if (cellData.value !== null) {
        episodeData.value = await getEpisodeInfos(
          cellData.value.season_number,
          cellData.value.episode_number
        )
        //@ts-ignore
        dialog.value = !dialog.value
      }
    }

    const getColor = (rating: number) => {
      if (rating === 0) {
        return 'bg-gray-500 cursor-pointer'
      }
      if (rating < 6) {
        return 'hover:bg-gray-600  cursor-pointer bg-red-500'
      }
      if (rating < 7) {
        return 'hover:bg-gray-600  cursor-pointer bg-orange-500'
      }
      if (rating < 8) {
        return 'hover:bg-gray-600  cursor-pointer bg-yellow-500'
      }
      if (rating >= 8) {
        return 'hover:bg-gray-600  cursor-pointer bg-green-500'
      }
    }

    return { cellData, getColor, dialog, toggleDialog, episodeData, tvShowId }
  },
})
</script>
