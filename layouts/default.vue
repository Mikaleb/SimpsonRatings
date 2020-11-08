<template>
  <v-app :dark="goDark">
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="visible lg:invisible"
      ></v-app-bar-nav-icon>
      <v-toolbar dense flat color="elevation-0" class="bg-transparent">
        <v-row>
          <v-col cols="2" />
          <v-col class="d-flex justify-space-around">
            <v-toolbar-title>
              <v-flex xs12>
                <nuxt-link to="/">
                  <v-img
                    :src="require('~/assets/images/logo.svg')"
                    class="my-3"
                    contain
                    width="128"
                  />
                </nuxt-link>
              </v-flex>
            </v-toolbar-title>
          </v-col>
          <v-col
            cols="2"
            class="items-center justify-end d-flex justify-space-around"
          >
            <v-btn
              class="invisible lg:visible"
              v-cloak
              text
              color="primary"
              @click="goDark = !goDark"
            >
              <!-- <v-switch class="justify-space-around" v-model="goDark"> -->
              <template v-if="!goDark">
                <fa :icon="['far', 'moon']" />
              </template>
              <template v-else>
                <fa :icon="['fas', 'sun']" />
              </template>
            </v-btn>
            <div class="invisible lg:visible">
              <about />
            </div>
            <v-btn
              class="invisible lg:visible"
              v-cloak
              href="https://github.com/Mikaleb/S-Ratings"
              text
              color="primary"
            >
              <fa :icon="['fab', 'github']" />
              <span class="pl-1">Github</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-toolbar>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <nuxt />
      </v-container>
    </v-main>

    <v-footer>
      <span
        >&copy; 2020 -
        {{
          new Date().getFullYear() !== 2020
            ? new Date().getFullYear() + ' - '
            : ''
        }}
        Mikaleb</span
      >
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, watch, ref } from '@nuxtjs/composition-api'
import About from '~/components/About.vue'
export default defineComponent({
  name: 'default',
  components: { About },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setup(props, ctx: any) {
    const clipped = false
    let goDark = ref(true)
    let drawer = ref(false)

    watch(goDark, (value, prevValue) => {
      ctx.root.$vuetify.theme.dark = value
    })

    const items = [
      {
        icon: 'mdi-apps',
        title: 'Welcome',
        to: '/',
      },
      {
        icon: 'mdi-chart-bubble',
        title: 'Inspire',
        to: '/inspire',
      },
    ]
    const miniVariant = false
    const right = true
    const rightDrawer = false
    const title = 'Vuetify.js'
    return {
      clipped,
      drawer,
      items,
      miniVariant,
      right,
      rightDrawer,
      title,
      goDark,
    }
  },
})
</script>
