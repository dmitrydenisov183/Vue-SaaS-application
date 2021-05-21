<template>
  <v-tabs
    v-model="localValue"
    v-bind="{ ...$attrs, ...$props }"
    class="tabs"
    @change="$emit('change', $event)"
  >
    <slot />
  </v-tabs>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component
export default class BaseTabs extends Vue {
  @Model('change', {
    type: Number,
    required: true
  })
  readonly value!: number;

  get localValue (): number {
    return this.value
  }

  set localValue (value: number) {
    this.$emit('change', value)
  }
}
</script>

<style lang="scss" scoped>
  .tabs {
    ::v-deep {
      .v-item-group {
        background-color: $color-tundora;
        .v-slide-group__wrapper {
          padding: 0 40px;
          .v-tabs-slider-wrapper {
            color: #FFFFFF !important;
          }
          .v-tab {
            text-transform: capitalize;
            color: $color-edward !important;
            font-weight: $font-weight-normal;
            &--active {
              color: #FFFFFF !important;
              font-weight: $font-weight-bold;
            }
          }
        }
      }
    }
  }
</style>
