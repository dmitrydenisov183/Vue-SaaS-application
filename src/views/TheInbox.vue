<template>
  <div class="inbox">
    <base-tabs v-model="activeTab">
      <v-tab>Metrics</v-tab>
      <v-tab>Settings</v-tab>
    </base-tabs>
    <base-tabs-items v-model="activeTab">
      <v-tab-item :transition="false" :reverse-transition="false">
        <inbox-metrics
          v-if="inbox"
          :inbox="inbox"
          class="mx-0 px-0 p-2"
          @changed="onStatusChanged"
          @schedule-updated="fetch"
        />
      </v-tab-item>
      <v-tab-item :transition="false" :reverse-transition="false">
        <inbox-settings
          v-if="inbox"
          :inbox="inbox"
          class="mx-0 px-0 p-2"
          @changed="onStatusChanged"
          @delete="onDelete"
          @schedule-updated="fetch"
        />
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
import { Component, Vue } from 'vue-property-decorator'
import InboxMetrics from '@/components/InboxMetrics.vue'
import InboxSettings from '@/components/InboxSettings.vue'
import Inbox from '@/types/Inbox'
import RequestStatus from '@/constants/RequestStatus'
import InboxRepository from '@/data/repository/InboxRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { AxiosResponse } from 'axios'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'
import InboxState from '@/constants/InboxState'
import { EventBus } from '@/main'

@Component({ components: { InboxMetrics, InboxSettings } })
export default class TheInbox extends Vue {
  activeTab = 0
  status: RequestStatus = RequestStatus.Initial
  errorMessage = ''
  inbox: Inbox | null = null
  inboxActiavted = false

  get inboxId (): string {
    return this.$route.params.inboxId
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  async fetch (): Promise<void> {
    if (this.isLoading || !this.inboxId) return

    this.status = RequestStatus.Loading
    this.inbox = null

    const response = await new InboxRepository().fetch(this.inboxId)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.inbox = (response as AxiosResponse<Inbox>).data
    document.title = this.inbox.email
      ? `${this.inbox.email} | Warmup Inbox`
      : 'Inbox Details | Warmup Inbox'
    EventBus.$emit('inboxEmail', this.inbox.email)
    this.status = RequestStatus.Success
  }

  async onDelete (): Promise<void> {
    if (this.isLoading || !this.inbox) return

    this.status = RequestStatus.Loading

    const response = await new InboxRepository().delete(this.inbox.inbox_id)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.status = RequestStatus.Success
    this.$router.push({ name: 'inboxes' })
    sendFlashMessage({
      status: 'success',
      message: 'You have successfully delete the inbox.'
    })
  }

  onStatusChanged (event: { status: string }): void {
    if (event.status === InboxState.Running) {
      sendFlashMessage({
        status: 'success',
        message: 'Success! The first email on this inbox will send in the next few minutes.'
      })
    }
    this.fetch()
  }

  mounted () {
    this.fetch()
  }
}
</script>

<style lang="scss" scoped>
  .inbox {
    width: 100%;
    background-color: #FFFFFF;
  }
</style>
