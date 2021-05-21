<template>
  <v-switch
    v-model="localValue"
    v-bind="{ ...$attrs, ...$props }"
    :color="hasError ? 'red' : '#00d474'"
    :class="{ 'has-error': hasError }"
    :label="label"
    :ripple="false"
    flat
    inset
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component
export default class BaseSwitch extends Vue {
  @Model('change', {
    type: Boolean
  })
  readonly value!: boolean

  @Prop({
    type: String,
    default: ''
  })
  readonly label!: string

  @Prop({
    type: Boolean
  })
  readonly hasError!: boolean

  get localValue (): boolean | null {
    return this.value
  }

  set localValue (value: boolean | null) {
    this.$emit('change', value)
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-input {
      &--selection-controls__input {
        margin-right: 0px;
      }
      &--switch {
        &__track {
          opacity: 1;
          height: 22px !important;
          width: 45px;
        }
        &__thumb {
          color: #FFFFFF !important;
          top: calc(50% - 11px);
          height: 16px;
          width: 16px;
        }
      }
    }
    .v-label {
      font-size: 14px;
      padding-bottom: 10px !important;
    }
  }
  .has-error::v-deep {
    .v-label {
      color: red !important;
    }
  }
</style>
