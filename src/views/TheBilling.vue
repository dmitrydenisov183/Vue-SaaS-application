<template>
  <div class="billing">
    <base-tabs v-model="activeTab">
      <v-tab>Subscription</v-tab>
    </base-tabs>
    <base-tabs-items v-model="activeTab">
      <v-tab-item>
        <v-container fluid>
          <v-row v-if="billing">
            <v-col cols="12" md="7">
              <div class="billing__title mb-1">
                Current Subscription
                <div class="float-none float-sm-right">
                  <update-subscription-modal :billing="billing" v-if="hasSubscription" @updated="onUpdate" />
                </div>
              </div>
              <v-divider />
              <div class="mt-3 mb-2">Using {{ creditsInUse }}/{{ planCredits }} Inboxes</div>
              <div v-if="hasSubscription">{{ billing.helper_text }}</div>
              <div v-else>
                Your free trial ends {{ trialEndsPretty }}
                (<div class="d-inline-block">
                  <subscribe-modal :billing="billing" @updated="onUpdate" />
                </div>)
              </div>
            </v-col>
          </v-row>
          <v-row class="mt-16">
            <v-col cols="12" md="7">
              <div class="billing__title mb-1">
                Refer a Friend
              </div>
              <v-divider />
              <p class="mt-3">
                You can earn a 20% commission <b>every month</b> for every customer you refer to Warmup Inbox. Use your unique
                link below so you can share on your blog, podcast, twitter or to your email newsletter list. After your
                first sign up, we’ll email you a form to get you set up for payouts.
              </p>
              <base-button class="billing__referal text-capitalize mt-5 px-6 font-weight-bold" @click="onCopyLink">
                Copy Referral Link
              </base-button>
            </v-col>
          </v-row>
        </v-container>
      </v-tab-item>
    </base-tabs-items>
    <v-overlay :value="isLoading">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import UpdateSubscriptionModal from '@/components/modals/UpdateSubscriptionModal.vue'
import SubscribeModal from '@/components/modals/SubscribeModal.vue'
import { copyToClipboard, getErrorMessage, sendFlashMessage } from '@/utils/misc'
import AuthModule from '@/store/modules/AuthModule'
import RequestStatus from '@/constants/RequestStatus'
import BillingRepository from '@/data/repository/BillingRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import Billing from '@/types/Billing'
import { AxiosResponse } from 'axios'
import SubscriptionPlan from '@/constants/SubscriptionPlan'
import SubscriptionState from '@/constants/SubscriptionState'

@Component({ components: { UpdateSubscriptionModal, SubscribeModal } })
export default class TheBilling extends Vue {
  activeTab = 0
  status: RequestStatus = RequestStatus.Initial
  billing: Billing | null = null

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get hasSubscription (): boolean {
    return (!!AuthModule.plan && AuthModule.plan !== SubscriptionPlan.Free) ||
      (!!this.billing && this.billing.display_code === SubscriptionState.Resubscribe)
  }

  get planCredits (): number | null {
    return AuthModule.planCredits
  }

  get availableCredits (): number | null {
    return AuthModule.availableCredits
  }

  get trialEndsPretty (): string | null {
    return AuthModule.trialEndsPretty
  }

  get creditsFetchValue (): number {
    if (this.planCredits === 0 && this.availableCredits === 0) {
      return 0
    }

    if (this.planCredits !== null && this.planCredits > 0) {
      return this.planCredits
    }

    return 1
  }

  get creditsInUse (): number | undefined {
    return this.planCredits !== null && this.availableCredits !== null
      ? this.planCredits - this.availableCredits
      : 0
  }

  async fetch (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new BillingRepository().fetch(this.creditsFetchValue)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.status = RequestStatus.Success
    this.billing = (response as AxiosResponse<Billing>).data
  }

  onCopyLink (): void {
    const shareableCode = AuthModule.shareableCode

    if (shareableCode) {
      copyToClipboard(`${process.env.VUE_APP_BASE_REFERRAL_URL}/sign-up?code=${shareableCode}`)

      sendFlashMessage({
        status: 'success',
        message: 'Referal link copied to your clipbloard'
      })
    }
  }

  async onUpdate (): Promise<void> {
    await AuthModule.getUser()
    this.fetch()
    sendFlashMessage({
      status: 'success',
      message: 'Your changes were successfully made.'
    })
  }

  async mounted () {
    await AuthModule.getUser()
    this.fetch()
  }

  @Watch('planCredits')
  onCreditsChange () {
    this.fetch()
  }
}
</script>

<style lang="scss" scoped>
  .billing {
    font-family: $label-font;
    width: 100%;
    background-color: #FFFFFF;
    &__title {
      font-size: $font-md-x;
      font-weight: $font-weight-bold;
    }
    &__referal {
      width: 130px !important;
      height: 30px !important;
      font-size: $font-xs-x !important;
      letter-spacing: -0.2px;
    }
  }
</style>
