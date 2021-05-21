<template>
  <v-app>
    <v-main>
      <flash-message />
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import FlashMessage from '@/components/FlashMessage.vue'
import { EventBus } from './main'

@Component({ components: { FlashMessage } })
export default class App extends Vue {
  mounted () {
    this.$drift.reset()
    EventBus.$on('driftData', (event) => {
      this.$drift.identify(event.id, {
        name: event.name,
        email: event.email,
        plan: event.plan,
        api_key: event.apiKey
      })
    })

    EventBus.$on('closeDriftConnection', () => {
      this.$drift.reset()
      window.location.href = '/login'
    })
  }
}
</script>

<style lang="scss">
  @import url(./scss/_fonts.scss);
  * {
    word-break: keep-all !important;
  }

  .drift-frame-controller {
    height: 78px !important;
  }

  #app {
    background-color: $bg-color;
    font-size: $font-md;
    font-family: $label-font;
  }
</style>
