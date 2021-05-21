<template>
  <base-modal
    v-model="dialog"
    max-width="550"
    :title="billing && billing.header_text"
    title-class="title--sm"
    :small-spinner="isFetchLoading"
    @input="fetch()"
  >
    <template #button>
      <v-btn
        class="edit-subscription__link text-capitalize pl-0"
        small
        text
        elevation="0"
        @click.stop="dialog = !dialog"
      >
        Edit Subscription
      </v-btn>
    </template>

    <template #content>
      <base-alert v-if="isError" class="mt-3" variant="error">
        {{ errorMessage }}
      </base-alert>
      <div class="mt-5 d-block d-sm-flex align-center">
        <div class="d-flex align-end">
          <base-input v-model="computedCredits" class="edit-subscription__input d-inline-block" hide-details />
          <v-btn
            class="edit-subscription__input-control d-inline-block"
            elevation="0"
            tile
            @click="decrease"
          >
            <base-icon class="pr-0 pl-0 pt-0 pb-0">mdi-minus</base-icon>
          </v-btn>
          <v-btn
            class="edit-subscription__input-control d-inline-block"
            elevation="0"
            tile
            @click="increase"
          >
            <base-icon class="pr-0 pl-0 pt-0 pb-0">mdi-plus</base-icon>
          </v-btn>
        </div>
        <div class="d-inline-block ml-0 ml-sm-3 mt-3 mt-sm-0 edit-subscription__text">
          Please select the desired number of inboxes.
        </div>
      </div>
      <v-divider class="mt-6 mb-3" />
      <div>
        <v-container class="py-0 px-0">
          <v-row>
            <v-col cols="6" sm="5" class="py-0">
              <b>{{ billing && billing.per_month_label }}:</b>
            </v-col>
            <v-col cols="6" sm="7" class="py-0">
              <span class="edit-subscription__amount">{{ billing && billing.per_month_value }}</span>
            </v-col>
          </v-row>
          <v-row v-if="isNoChange">
            <v-col cols="12" class="pt-2">
              <div class="edit-subscription__info">{{ billing.helper_text }}</div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-divider class="mt-2 mb-3" />
      <template v-if="billing && billing.secondary_label">
        <v-container class="py-0 px-0">
          <v-row>
            <v-col cols="6" sm="5" class="py-0">
              <b>{{ billing.secondary_label }}:</b>
            </v-col>
            <v-col cols="6" sm="7" class="py-0">
              <span class="edit-subscription__amount">{{ billing.secondary_value }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="pt-2">
              <div class="edit-subscription__info">{{ billing.helper_text }}</div>
            </v-col>
          </v-row>
        </v-container>
        <v-divider class="mt-2 mb-3" />
      </template>
      <div
        class="edit-subscription__action d-flex justify-end"
        :class="{ 'justify-space-between align-center': cardOnFile && isResubscrie }"
      >
        <div v-if="cardOnFile && isResubscrie">
          <div class="mb-1">
            <b>Charge Card On File:</b>
          </div>
          <div class="d-flex align-center ml-n1">
            <img class="edit-subscription__card-icon mr-2" :src="cardOnFile.card_icon" />
            <span class="edit-subscription__card-text">
              {{ cardOnFile.card_brand }} ending in {{ cardOnFile.card_last4 }}
            </span>
          </div>
        </div>
        <base-button
          class="text-capitalize font-weight-bold"
          :disabled="isError || isNoChange"
          :loading="isSubmitLoading"
          @click="onSubmit"
        >
          {{ submitButtonText }}
        </base-button>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AddInboxForm from '@/components/forms/AddInboxForm.vue'
import Billing from '@/types/Billing'
import RequestStatus from '@/constants/RequestStatus'
import SubscriptionState from '@/constants/SubscriptionState'
import AuthModule from '@/store/modules/AuthModule'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getErrorMessage } from '@/utils/misc'
import BillingRepository from '@/data/repository/BillingRepository'
import BillingForm from '@/types/BillingForm'
import BillingCard from '@/types/BillingCard'
import { AxiosResponse } from 'axios'

@Component({ components: { AddInboxForm } })
export default class UpdateSubscriptionModal extends Vue {
  dialog = false
  billing: Billing | null = null
  submitStatus: RequestStatus = RequestStatus.Initial
  fetchStatus: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  mask = '/^[a-z][0-9]+(-[a-z][0-9]+)*$/'
  billingForm: BillingForm = {
    new_seat_count: this.planCredits,
    use_card_on_file: true,
    card_number: null,
    exp_month: null,
    exp_year: null,
    security_code: null,
    postal_code: null
  }

  get isError (): boolean {
    return this.fetchStatus === RequestStatus.Error || this.submitStatus === RequestStatus.Error
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

  get isResubscrie (): boolean {
    return !!this.billing && this.billing.display_code === SubscriptionState.Resubscribe
  }

  get submitButtonText (): string {
    if (this.isUnsubscribe) {
      return 'Cancel Subscription'
    }

    if (this.isResubscrie) {
      return `Subscribe & Pay ${this.billing?.secondary_value}`
    }

    return 'Confirm Changes'
  }

  get planCredits (): number {
    return AuthModule.planCredits ? AuthModule.planCredits : 1
  }

  get cardOnFile (): BillingCard | null {
    return AuthModule.cardOnFile
  }

  get computedCredits (): number {
    return this.billingForm.new_seat_count
  }

  set computedCredits (value: number) {
    if (!isNaN(value) || Number(value) === 0) {
      this.billingForm.new_seat_count = value
      this.fetch()
    }
  }

  increase (): void {
    this.computedCredits++
  }

  decrease (): void {
    if (this.computedCredits !== 0) this.computedCredits--
  }

  async fetch (): Promise<void> {
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
      use_card_on_file: true,
      card_number: null,
      exp_month: null,
      exp_year: null,
      security_code: null,
      postal_code: null
    }
    this.fetch()
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
    }
    .v-input__slot {
      min-height: 29px !important;
      height: 29px;
    }
    .input__wrapper {
      label {
        margin-bottom: 0 !important;
      }
    }
  }
  .edit-subscription {
    &__link {
      font-size: $font-md;
      color: $color-dodger-blue !important;
      font-weight: $font-weight-bold;
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
      button {
        font-size: $font-xs-x;
      }
    }
    &__card-icon {
      width: 35px
    }
    &__card-text {
      font-size: $font-sm;
    }
  }
</style>
