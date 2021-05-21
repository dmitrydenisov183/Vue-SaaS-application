<template>
  <v-icon
    :class="`px-5 py-5 icon--${variant}`"
    v-bind="{ ...$attrs }"
  >
    <slot />
  </v-icon>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BaseIcon extends Vue {
  @Prop({
    type: String,
    default: 'primary'
  })
  readonly variant!: string
}
</script>

<style lang="scss" scoped>
  .icon {
    &--primary {
      color: #000000 !important;
    }
    &--secondary {
      color: #FFFFFF !important;
    }
  }
</style>
