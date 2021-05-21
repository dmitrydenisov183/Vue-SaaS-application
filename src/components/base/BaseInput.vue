<template>
  <div :class="`input--${variant} input__wrapper`">
    <label v-if="!tooltip" class="d-block">
      {{ customLabel }}
      <span v-if="helpText" class="input__help-text text-capitalize">
        <i>{{ helpText }}</i>
      </span>
    </label>
    <v-tooltip v-else max-width="300" top>
      <template v-slot:activator="{ on, attrs }">
        <label class="d-block" v-bind="attrs" v-on="on">
          {{ customLabel }}
          <span v-if="helpText" class="input__help-text text-capitalize">
            <i>{{ helpText }}</i>
          </span>
        </label>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>
    <v-text-field
      v-model="localValue"
      :placeholder="placeholder"
      v-bind="{ ...$attrs, ...$props }"
      :class="{ 'disabled': $attrs.disabled }"
      outlined
      dense
      single-line
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component
export default class BaseInput extends Vue {
  @Model('change', {
    type: [String, Number],
    required: true
  })
  readonly value!: string | number

  @Prop({
    type: String,
    default: ''
  })
  readonly customLabel?: string

  @Prop({
    type: String,
    default: ''
  })
  readonly helpText?: string

  @Prop({
    type: String,
    default: ''
  })
  readonly placeholder?: string

  @Prop({
    type: String,
    default: 'main'
  })
  readonly variant?: string

  @Prop({
    type: String
  })
  readonly tooltip?: string

  get localValue (): string | number {
    return this.value
  }

  set localValue (value: string | number) {
    this.$emit('change', value)
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .disabled {
      .v-input__slot {
        background-color: $color-alto;
      }
    }
    .v-messages__message {
      font-size: $font-xs;
    }
    .v-text-field {
      &__details {
        padding: 0 !important;
        margin-bottom: 0px !important;
        font-size: $font-xs-x;
      }
      &--outlined {
        &.v-input--is-focused {
          fieldset {
            border-color: #000000 !important;
          }
          .v-input {
            &__icon i {
              color: #000000 !important;
            }
          }
        }
      }
      &.v-input--dense .v-label--active {
        transform: translateY(0) scale(0) !important;
      }
    }
    fieldset {
      border-radius: 0;
    }
    label {
      font-family: $label-font;
      font-weight: $font-weight-bold;
    }
    .v-input {
      &__control {
        caret-color: #000000;
        font-size: $font-md;
      }
      &__icon i {
        font-size: 17px !important;
      }
    }
  }

  .v-tooltip__content {
    font-size: $font-xs !important;
    line-height: 12px;
    background-color: $secondary-color !important;
  }

  .v-tooltip__content.menuable__content__active {
    opacity: 1 !important;
  }

  .input {
    &__wrapper {
      label {
        margin-bottom: 8px;
      }
    }
    &--main {
      ::v-deep {
        label {
          font-size: $font-xs;
          opacity: 0.8;
          text-transform: uppercase;
          color: $color-mako;
        }
      }
    }
    &--normal {
      ::v-deep {
        label {
          font-size: $font-sm;
          color: $secondary-color;
        }
      }
    }

    &__help-text {
      font-size: $font-xs;
      color: $secondary-color;
      opacity: 0.8;
      font-weight: $font-weight-normal;
    }
  }
</style>
