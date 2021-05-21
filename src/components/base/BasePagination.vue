<template>
  <v-pagination v-bind="{ ...$attrs, ...$props }" v-on="$listeners" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class BasePagination extends Vue {}
</script>
