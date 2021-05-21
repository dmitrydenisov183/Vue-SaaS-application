<template>
  <v-checkbox v-model="localValue" v-bind="{ ...$attrs, ...$props }" />
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component
export default class BaseCheckbox extends Vue {
  @Model('change', {
    type: Boolean,
    required: true
  })
  readonly value!: boolean

  get localValue (): boolean {
    return this.value
  }

  set localValue (value: boolean) {
    this.$emit('change', value)
  }
}
</script>

<style lang="scss" scoped>
 ::v-deep {
   label {
    font-size: $font-xs;
    font-family: $label-font;
  }
 }
</style>
