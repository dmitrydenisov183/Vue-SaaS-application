<template>
  <v-alert
    :class="`alert--${variant}`"
    v-bind="{ ...$attrs, ...$props }"
    v-on="$listeners"
    close-icon="mdi-close"
    dismissible
  >
    <slot />
  </v-alert>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BaseAlert extends Vue {
  @Prop({
    type: String,
    default: 'success'
  })
  readonly variant!: string
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-btn__content {
      .v-icon {
        color: #FFFFFF !important;
        font-size: $font-sm;
      }
    }
  }
  .v-alert {
    padding: 10px 18px;
    color: #FFFFFF;
    font-size: $font-sm;
    font-weight: $font-weight-bold;
    &.alert {
      &--error {
        background-color: $color-amaranth !important;
      }
      &--success {
        background-color: $color-mountain-meadow;
      }
    }
  }
</style>
