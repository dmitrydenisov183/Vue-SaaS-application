<template>
  <div class="d-flex align-center inbox-control">
    <base-switch
      :value="isRunning"
      class="d-inline-block "
      :has-error="isError"
      :label="label"
      :loading="isLoading"
      @change="onChange"
    />
    <span v-if="showStatus" class="d-inline-block mb-2">
      <span v-if="isRunning" class="inbox-control__running font-weight-bold">Running</span>
      <span v-else class="inbox-control__paused font-weight-bold">Paused</span>
    </span>
  </div>
</template>

<script lang="ts">
import InboxSimple from '@/types/InboxSimple'
import { Component, Vue, Prop } from 'vue-property-decorator'
import InboxState from '@/constants/InboxState'
import RequestStatus from '@/constants/RequestStatus'
import InboxRepository from '@/data/repository/InboxRepository'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import Inbox from '@/types/Inbox'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'

@Component
export default class InboxControl extends Vue {
  @Prop({
    type: Object as () => InboxSimple | Inbox,
    required: true
  })
  readonly inbox!: InboxSimple | Inbox

  @Prop({
    type: String
  })
  readonly label!: string

  @Prop({
    type: Boolean,
    default: false
  })
  readonly showStatus!: boolean

  status: RequestStatus = RequestStatus.Initial
  localState: InboxState = this.inbox.status

  get isError (): boolean {
    return this.status === RequestStatus.Error
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get isRunning (): boolean {
    return this.localState === InboxState.Running
  }

  async onChange (): Promise<void> {
    if (this.isLoading) return

    this.status = RequestStatus.Loading

    const response = this.isRunning
      ? await new InboxRepository().pause(this.inbox.inbox_id)
      : await new InboxRepository().start(this.inbox.inbox_id)

    if (isFailureResponse(response)) {
      this.status = RequestStatus.Error
      sendFlashMessage({
        status: 'error',
        message: getErrorMessage(response as FailureResponse)
      })

      return
    }

    this.localState = this.isRunning ? InboxState.Paused : InboxState.Running
    this.status = RequestStatus.Success
    this.$emit('changed', { status: this.localState })
  }
}
</script>

<style lang="scss" scoped>
  .inbox-control {
    max-width: min-content;
    font-size: 15px;
    &__running {
      color: $color-mountain-meadow;
    }
    &__paused {
      color: $color-french-gray
    }
  }
</style>
