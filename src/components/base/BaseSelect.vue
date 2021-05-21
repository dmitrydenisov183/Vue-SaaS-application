<template>
  <div :class="`input--${variant}`">
    <label class="d-block mb-2">
      {{ customLabel }}
      <span v-if="helpText" class="input__help-text text-capitalize">
        <i>{{ helpText }}</i>
      </span>
    </label>
    <v-select
      v-model="localValue"
      :items="items"
      v-bind="{ ...$attrs, ...$props }"
      dense
      outlined
      hide-details="auto"
      v-on="$listeners"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Model } from 'vue-property-decorator'

@Component
export default class BaseSelect extends Vue {
  @Model('select', {
    type: String,
    required: true
  })
  readonly value!: string;

  @Prop({
    type: Array,
    required: true
  })
  readonly items!: string[]

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
    default: 'main'
  })
  readonly variant?: string

  get localValue (): string {
    return this.value
  }

  set localValue (value: string) {
    this.$emit('select', value)
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-text-field--outlined.v-input--is-focused fieldset {
      border-color: #000000 !important;
    }
    .v-text-field--outlined .v-input--dense .v-label--active {
      transform: translateY(0) scale(0) !important;
    }
    fieldset {
      border-radius: 0;
      font-size: $font-xs-x;
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
      &__icon {
        i {
          color: #000000!important;
        }
      }
    }
  }
  .input {
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
