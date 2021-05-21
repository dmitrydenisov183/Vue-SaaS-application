<template>
  <base-modal
    v-model="dialog"
    max-width="550"
    :title="billing && billing.header_text"
    title-class="title--sm"
    :small-spinner="isFetchLoading"
  >
    <template #button>
      <a
        :class="`subscribe__link link--${linkVariant} text-capitalize pl-0`"
        @click.stop="dialog = !dialog"
      >
        Upgrade now
      </a>
    </template>

    <template #content>
      <validation-observer v-slot="{ invalid }">
        <base-alert v-if="isError" class="mt-3" variant="error">
          {{ errorMessage }}
        </base-alert>
        <div class="mt-5 d-block d-sm-flex align-center">
          <div class="d-flex align-end">
            <validation-provider
              v-slot="{ errors }"
              name="credits"
              rules="required|numeric"
              :debounce="500"
            >
              <base-input
                v-model="computedCredits"
                :error-messages="errors"
                class="subscribe__input d-inline-block"
                hide-details
              />
            </validation-provider>
            <v-btn
              class="subscribe__input-control d-inline-block"
              elevation="0"
              tile
              @click="decrease"
            >
              <base-icon class="pr-0 pl-0 pt-0 pb-0">mdi-minus</base-icon>
            </v-btn>
            <v-btn
              class="subscribe__input-control d-inline-block"
              elevation="0"
              tile
              @click="increase"
            >
              <base-icon class="pr-0 pl-0 pt-0 pb-0">mdi-plus</base-icon>
            </v-btn>
          </div>
          <div class="d-inline-block ml-0 ml-sm-3 mt-3 mt-sm-0 subscribe__text">
            Please select the desired number of inboxes.
          </div>
        </div>
        <v-divider class="mt-6 mb-3" />
        <div>
          <v-container class="py-0 px-0">
            <v-row>
              <v-col cols="6" sm="4" class="py-0">
                <b>{{ billing && billing.per_month_label }}:</b>
              </v-col>
              <v-col cols="6" sm="8" class="py-0">
                <span class="subscribe__amount">{{ billing && billing.per_month_value }}</span>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <v-divider class="my-3" />
        <v-container class="py-0 px-0">
          <v-row>
            <v-col cols="6" sm="4" class="py-0">
              <b>{{ billing && billing.secondary_label }}:</b>
            </v-col>
            <v-col cols="6" sm="8" class="py-0">
              <span class="subscribe__amount">{{ billing && billing.secondary_value }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pt-2">
              <div class="subscribe__info">{{ billing && billing.helper_text }}</div>
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="mb-3" />
        <v-container class="py-0 px-0">
          <v-row>
            <v-col cols="12" class="py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Card number"
                :rules="{
                  required: true,
                  regex: '[0-9 ]+',
                  min_numbers: computedCreditCard.substr(0, 2) === '37' ? 15 : 16
                }"
                :debounce="500"
              >
                <base-input
                  v-model="computedCreditCard"
                  :error-messages="errors"
                  custom-label="Card Number"
                  variant="normal"
                  :maxlength="computedCreditCard.substr(0, 2) === '37' ? 17 : 19"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="4" class="py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Expiration date"
                rules="required|date"
                :debounce="500"
              >
                <base-input
                  v-model="computedExpDate"
                  :error-messages="errors"
                  custom-label="Expiration Date"
                  variant="normal"
                  placeholder="MM/YYYY"
                  maxlength="7"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="4" class="py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Security code"
                rules="required|numeric|min:3"
                :debounce="500"
              >
                <base-input
                  v-model="billingForm.security_code"
                  :error-messages="errors"
                  custom-label="Security Code"
                  variant="normal"
                />
              </validation-provider>
            </v-col>
            <v-col cols="12" sm="4" class="py-0">
              <validation-provider
                v-slot="{ errors }"
                name="Postal code"
                rules="required"
                :debounce="500"
              >
                <base-input
                  v-model="billingForm.postal_code"
                  :error-messages="errors"
                  custom-label="Postal Code"
                  variant="normal"
                />
              </validation-provider>
            </v-col>
          </v-row>
        </v-container>
        <div class="d-flex justify-end subscribe__action">
          <base-button
            class="text-capitalize font-weight-bold"
            :disabled="isFetchError || invalid || isNoChange"
            :loading="isSubmitLoading"
            @click="onSubmit"
          >
            {{ submitButtonText }}
          </base-button>
        </div>
      </validation-observer>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AddInboxForm from '@/components/forms/AddInboxForm.vue'
import Billing from '@/types/Billing'
import AuthModule from '@/store/modules/AuthModule'
import RequestStatus from '@/constants/RequestStatus'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getAmexCreditCardFormat, getCreditCardFormat, getErrorMessage } from '@/utils/misc'
import BillingRepository from '@/data/repository/BillingRepository'
import { AxiosResponse } from 'axios'
import BillingForm from '@/types/BillingForm'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, numeric, regex } from 'vee-validate/dist/rules'
import SubscriptionState from '@/constants/SubscriptionState'

extend('required', required)
extend('numeric', numeric)
extend('min_numbers', {
  validate: (value, { length }) => {
    return value.replace(/\s/g, '').length >= length
  },
  params: ['length'],
  message: '{_field_} should be not less than {length} digits'
})
extend('regex', regex)
extend('date', {
  validate: (value) => {
    const month = value.split('/')[0]
    const year = value.split('/')[1]

    return (month.length === 2 && Number(month) <= 12) && (year.length === 4 && year >= new Date().getFullYear())
  },
  message: '{_field_} not valid'
})

@Component({ components: { AddInboxForm, ValidationObserver, ValidationProvider } })
export default class SubscribeModal extends Vue {
  @Prop({
    type: String,
    default: 'success'
  })
  readonly linkVariant!: string

  dialog = false
  billing: Billing | null = null
  submitStatus: RequestStatus = RequestStatus.Initial
  fetchStatus: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  mask = '/^[a-z][0-9]+(-[a-z][0-9]+)*$/'
  billingForm: BillingForm = {
    new_seat_count: this.planCredits,
    use_card_on_file: false,
    card_number: '',
    exp_month: '',
    exp_year: '',
    security_code: '',
    postal_code: ''
  }

  get isError (): boolean {
    return this.fetchStatus === RequestStatus.Error || this.submitStatus === RequestStatus.Error
  }

  get isFetchError (): boolean {
    return this.fetchStatus === RequestStatus.Error
  }

  get isFetchLoading (): boolean {
    return this.fetchStatus === RequestStatus.Loading
  }

  get isSubmitLoading (): boolean {
    return this.submitStatus === RequestStatus.Loading
  }

  get isNoChange (): boolean {
    return !!this.billing && this.billing.display_code === SubscriptionState.NoChange
  }

  get isUnsubscribe (): boolean {
    return !!this.billing && this.billing.display_code === SubscriptionState.Unsubscribe
  }

  get isResubscribe (): boolean {
    return !!this.billing && this.billing.display_code === SubscriptionState.Resubscribe
  }

  get isNew (): boolean {
    return !!this.billing && this.billing.display_code === SubscriptionState.New
  }

  get submitButtonText (): string {
    if (this.isUnsubscribe) {
      return 'Cancel Subscription'
    }

    if (this.isResubscribe || this.isNew) {
      return `Subscribe & Pay ${this.billing?.secondary_value}`
    }

    return 'Confirm Changes'
  }

  get planCredits (): number {
    return AuthModule.planCredits ? AuthModule.planCredits : 1
  }

  get computedCredits (): number {
    return this.billingForm.new_seat_count
  }

  set computedCredits (value: number) {
    if (!isNaN(value)) {
      this.billingForm.new_seat_count = value
      this.fetch()
    }
  }

  get computedExpDate (): string {
    return this.billingForm.exp_month && this.billingForm.exp_month.length >= 2
      ? `${this.billingForm.exp_month}/${this.billingForm.exp_year}`
      : `${this.billingForm.exp_month}`
  }

  set computedExpDate (value: string) {
    const splittedDate = value.split('/')
    this.billingForm.exp_month = splittedDate[0] ? splittedDate[0] : ''
    this.billingForm.exp_year = splittedDate[1] ? splittedDate[1] : ''
  }

  get computedCreditCard (): string | null {
    return this.billingForm.card_number
  }

  set computedCreditCard (value: string | null) {
    if (!value) {
      this.billingForm.card_number = ''

      return
    }

    this.billingForm.card_number = value.substring(0, 2) !== '37'
      ? getCreditCardFormat(value)
      : getAmexCreditCardFormat(value)
  }

  increase (): void {
    this.computedCredits++
  }

  decrease (): void {
    if (this.computedCredits !== 1) this.computedCredits--
  }

  async fetch (): Promise<void> {
    if (!this.billingForm.new_seat_count) return

    this.fetchStatus = RequestStatus.Loading

    const response = await new BillingRepository().fetch(this.billingForm.new_seat_count)

    if (isFailureResponse(response)) {
      this.fetchStatus = RequestStatus.Error
      this.errorMessage = getErrorMessage(response as FailureResponse)
      if (this.billing) {
        this.billing.per_month_value = ''
        this.billing.secondary_value = ''
        this.billing.helper_text = ''
      }

      setTimeout(() => {
        this.fetchStatus = RequestStatus.Initial
        this.errorMessage = ''
      }, 5000)

      return
    }

    this.fetchStatus = RequestStatus.Success
    this.billing = (response as AxiosResponse<Billing>).data
  }

  async onSubmit (): Promise<void> {
    if (this.isSubmitLoading) return

    this.submitStatus = RequestStatus.Loading

    const response = await new BillingRepository().save(this.billingForm)

    if (isFailureResponse(response)) {
      this.submitStatus = RequestStatus.Error
      this.errorMessage = getErrorMessage(response as FailureResponse)

      setTimeout(() => {
        this.submitStatus = RequestStatus.Initial
        this.errorMessage = ''
      }, 5000)

      return
    }

    this.submitStatus = RequestStatus.Success
    this.dialog = false
    // Clear form
    this.billingForm = {
      new_seat_count: this.planCredits,
      use_card_on_file: false,
      card_number: '',
      exp_month: '',
      exp_year: '',
      security_code: '',
      postal_code: ''
    }
    this.$emit('updated')
  }

  mounted () {
    this.fetch()
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    fieldset {
      border: 1px solid #E6E6E8 !important;
      caret-color: #000000 !important;
    }
    .v-input {
      &__slot {
        min-height: 29px !important;
        height: 29px;
      }
    }

    .v-card {
      &__title {
        font-size: $font-xs !important;
        color: red;
      }
    }

  }

  .subscribe {
    &__link {
      font-size: $font-md;
      text-decoration: underline;
      font-weight: $font-weight-bold;
      &.link--danger {
        color: $color-apricot !important;
      }
      &.link--success {
        color: $color-spring-rain !important;
      }
    }
    &__input {
      max-width: 90px;
      margin-bottom: 0 !important;
    }
    &__input-control {
      height: 29px !important;
      min-width: 29px !important;
      padding: 0 !important;
      border: 1px solid $color-iron !important;
      background-color: $color-concrete;
      border: 1px solid #000000;
      i {
        font-size: $font-md;
      }
    }
    &__text, &__amount, &__info {
      font-family: $label-font;
    }
    &__info {
      font-size: $font-sm;
    }
    &__action {
      font-family: $base-font;
      button {
        font-size: $font-xs-x;
      }
    }
  }
</style>
