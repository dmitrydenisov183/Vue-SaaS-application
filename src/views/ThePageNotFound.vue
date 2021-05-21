<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="not-found__code">
          404
        </div>
        <div class="not-found__text">
          Page Not Found
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ThePageNotFound extends Vue {}
</script>

<style lang="scss" scoped>
  .not-found {
    &__code {
      text-align: center;
      font-size: 7rem;
      font-weight: bold;
    }
    &__text {
      text-align: center;
      font-size: 2rem;
      font-weight: bold;
    }
  }
</style>
