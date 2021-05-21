<template>
  <div class="alert-wrapper d-flex justify-center mt-3">
    <base-alert
      v-if="isActive"
      class="mx-auto"
      width="600"
      :variant="status"
      @input="onClose"
    >
      {{ message }}
    </base-alert>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { EventBus } from '@/main'
import FlashMessageType from '@/types/FlashMessage'

@Component
export default class FlashMessage extends Vue {
  status = ''
  message = ''
  isActive = false

  onClose (): void {
    this.isActive = false
    this.message = ''
    this.status = ''
  }

  mounted () {
    EventBus.$on('flash-message', (flash: FlashMessageType) => {
      this.status = flash.status
      this.message = flash.message
      this.isActive = true

      setTimeout(() => this.onClose(), 5000)
    })
  }
}
</script>

<style lang="scss" scoped>
  .alert-wrapper {
    position: absolute;
    width: 100%;
    z-index: 1000;
  }
</style>
