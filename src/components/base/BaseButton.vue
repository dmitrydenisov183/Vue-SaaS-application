<template>
  <v-btn
    :class="`btn--${variant}`"
    class="d-flex align-center"
    v-bind="{ ...$attrs }"
    elevation="0"
    v-on="$listeners"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({
    type: String,
    default: 'primary'
  })
  readonly variant!: string
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-btn {
      &__content {
        display: flex;
        align-items: center;
        font-family: $base-font;
      }
    }
  }

  .btn {
    &--primary {
      color: #FFFFFF !important;
      background-color: $primary-color !important;
    }
    &--black {
      color: #FFFFFF !important;
      background-color: #000000 !important;
      ::v-deep {
        .v-btn {
          &__content {
            svg {
              fill: #FFFFFF;
            }
            i {
              color: #FFFFFF !important;
            }
          }
        }
      }
      &:hover {
        background-color: #000000 !important;
      }
    }
    &--secondary {
      color: #FFFFFF !important;
      font-family: 'SFUIText' !important;
      background-color: $secondary-color !important;
      ::v-deep {
        .v-btn {
          &__content {
            svg {
              fill: #FFFFFF;
            }
            i {
              color: #FFFFFF !important;
            }
          }
        }
      }
      &:hover {
        background-color: #000000 !important;
        ::v-deep {
        .v-btn {
          &__content {
            svg {
              fill: #000000;
            }
            i {
              color: #000000 !important;
            }
          }
        }
      }
      }
    }
    &--text {
      color: #000000 !important;
      background-color: transparent !important;
      &:before {
        background-color: transparent !important;
      }
      &:hover {
        background-color: #D6D6D6 !important;
      }
    }
  }
</style>
