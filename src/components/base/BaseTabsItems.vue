<template>
  <v-tabs-items
    v-model="value"
    v-bind="{ ...$attrs, ...$props }"
    class="tabs-items"
    @change="$emit('change', $event)"
  >
    <slot />
  </v-tabs-items>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator'

@Component
export default class BaseTabsItems extends Vue {
  @Model('change', {
    type: Number,
    required: true
  })
  readonly value!: number;
}
</script>

<style lang="scss" scoped>
  .tabs-items {
    padding: 10px 40px;
  }
</style>
