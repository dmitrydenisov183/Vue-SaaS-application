<template>
  <base-modal v-model="dialog" max-width="320" title="Edit Schedule">
    <template #button>
      <v-btn
        class="edit-schedule__link text-capitalize pl-0"
        small
        text
        elevation="0"
        @click.stop="dialog = true"
      >
        Edit Schedule
      </v-btn>
    </template>

    <template #content>
      <div class="pt-2">
        <base-alert v-if="isError" class="mt-3" variant="error">
          {{ errorMessage }}
        </base-alert>
        <validation-observer v-slot="{ invalid }">
        <validation-provider
          v-if="!isFreePlan"
          v-slot="{ errors }"
          name="Starting baseline"
          :rules="{ required: true, max_value: inboxCapabilities.starting_baseline, numeric: true }"
          :debounce="500"
        >
          <base-input
            v-model="scheduleForm.starting_baseline"
            :error-messages="errors"
            custom-label="starting baseline"
            :help-text="`(Suggested 0, Max ${inboxCapabilities.starting_baseline})`"
            tooltip="The starting number of emails we should send on day one."
            :disabled="inboxCapabilities.starting_baseline === 0"
          />
        </validation-provider>

        <!-- Free plan baseline input tooltip -->
        <v-tooltip v-else max-width="300" top>
          <template v-slot:activator="{ on, attrs }">
            <div v-bind="attrs" v-on="on">
              <base-input
                v-model="scheduleForm.starting_baseline"
                custom-label="starting baseline"
                :help-text="`(Suggested 0, Max ${inboxCapabilities.starting_baseline})`"
                tooltip="The starting number of emails we should send on day one."
                :disabled="true"
              />
            </div>
          </template>
          <span>You need to be on a paid plan in order to adjust the starting baseline.</span>
        </v-tooltip>
        <!-- end of tooltip -->

        <validation-provider
          v-slot="{ errors }"
          name="Increase per day"
          :rules="{ required: true, max_value: inboxCapabilities.increase_per_day, numeric: true }"
          :debounce="500"
        >
          <base-input
            v-model="scheduleForm.increase_per_day"
            :error-messages="errors"
            custom-label="increase per day"
            :help-text="`(Suggested 2, Max ${inboxCapabilities.increase_per_day})`"
            tooltip="The number of emails we will increase by each day."
          />
        </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Max sends per day"
            :rules="{ required: true, max_value: inboxCapabilities.max_sends_per_day, numeric: true }"
            :debounce="500"
          >
            <base-input
              v-model="scheduleForm.max_sends_per_day"
              :error-messages="errors"
              custom-label="max sends per day"
              :help-text="`(Suggested 40, Max ${inboxCapabilities.max_sends_per_day})`"
              tooltip="We will never send more than  this number of new inital emails per day."
            />
          </validation-provider>
          <validation-provider
            v-slot="{ errors }"
            name="Reply rate"
            :rules="{ required: true, max_value: inboxCapabilities.reply_rate, numeric: true }"
            :debounce="500"
          >
            <base-input
              v-model="scheduleForm.reply_rate_percent"
              :error-messages="errors"
              custom-label="reply rate %"
              :help-text="`(Suggested 30%, Max ${inboxCapabilities.reply_rate}%)`"
              append-icon="mdi-percent-outline"
              tooltip="We automatically reply to X percent of the emails that are received within the inbox. These are additional emails added on top of the Max Send Per Day rate."
            />
          </validation-provider>
          <div class="form__limit-hint pt-0">
            <i>Want to increase these limits? <a :href="`mailto:${supportEmail}`">Chat with us.</a></i>
          </div>
          <div class="d-flex justify-end">
            <base-button
              class="edit-schedule__submit mt-5 px-9 text-capitalize"
              :disabled="invalid"
              :loading="isLoading"
              @click="onSubmit"
            >
              Save
            </base-button>
          </div>
        </validation-observer>
      </div>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import AddInboxForm from '@/components/forms/AddInboxForm.vue'
import RequestStatus from '@/constants/RequestStatus'
import ScheduleForm from '@/types/ScheduleForm'
import Inbox from '@/types/Inbox'
import InboxRepository from '@/data/repository/InboxRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { getErrorMessage } from '@/utils/misc'
import { ValidationObserver, ValidationProvider, extend } from 'vee-validate'
import { required, max_value, numeric } from 'vee-validate/dist/rules'
import AuthModule from '@/store/modules/AuthModule'
import InboxCapabilites from '@/types/InboxCapabilities'
import SubscriptionPlan from '@/constants/SubscriptionPlan'

extend('required', required)
extend('max_value', max_value)
extend('numeric', numeric)

@Component({ components: { AddInboxForm, ValidationObserver, ValidationProvider } })
export default class EditScheduleModal extends Vue {
  @Prop({
    type: Object as () => Inbox,
    required: true
  })
  readonly inbox!: Inbox

  dialog = false
  status: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  scheduleForm: ScheduleForm = {
    inbox_id: this.inbox.inbox_id,
    starting_baseline: this.inbox.settings.sending.baseline ? this.inbox.settings.sending.baseline : 0,
    increase_per_day: this.inbox.settings.sending.increase_rate,
    max_sends_per_day: this.inbox.settings.sending.max_sends,
    reply_rate_percent: this.inbox.settings.sending.reply_rate
  }

  get isFreePlan (): boolean {
    return !!this.plan && this.plan === SubscriptionPlan.Free
  }

  get plan (): SubscriptionPlan | null {
    return AuthModule.plan
  }

  get isError (): boolean {
    return this.status === RequestStatus.Error
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get supportEmail () {
    return process.env.VUE_APP_SUPPORT_EMAIL
  }

  get inboxCapabilities (): InboxCapabilites | null {
    return AuthModule.inboxCapabilities
  }

  async onSubmit (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = await new InboxRepository().editSchedule(this.scheduleForm)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      this.errorMessage = getErrorMessage(response as FailureResponse)

      setTimeout(() => {
        this.status = RequestStatus.Initial
        this.errorMessage = ''
      }, 5000)

      return
    }

    this.status = RequestStatus.Success
    this.$emit('updated')
  }
}
</script>

<style lang="scss" scoped>
  .v-tooltip__content {
    font-size: $font-xs !important;
    line-height: 12px;
    background-color: $secondary-color !important;
  }

  .form {
    &__limit-hint {
      font-size: 9px;
      font-family: $label-font;
      letter-spacing: 0.9px;
    }
  }

  .edit-schedule {
    &__link {
      font-size: $font-md;
      color: $color-dodger-blue !important;
      font-weight: $font-weight-bold;
    }
    &__submit {
      width: 95px;
      height: 30px;
    }
  }
</style>
