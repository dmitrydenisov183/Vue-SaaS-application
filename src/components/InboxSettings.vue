<template>
  <v-container class="pr-0 pr-md-16" fluid>
    <v-row class="mb-6">
      <v-col cols="12" class="px-0 py-0">
        <div class="settings__title">
          <div class="font-weight-bold">{{ inbox.email }}</div>
          <inbox-control
            :inbox="inbox"
            class="d-inline-block py-0"
            show-status
            @changed="$emit('changed', $event)"
          />
          <v-divider />
        </div>
      </v-col>
    </v-row>
    <v-row class="settings__data data">
      <v-col cols="12" md="8">
        <div class="data__title">
          Sending
          <div class="float-right">
            <edit-schedule-modal :inbox="inbox" @updated="$emit('schedule-updated')" />
          </div>
        </div>
        <v-divider class="mb-2 mt-1" />
        <v-row class="mb-13">
          <v-col cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.settings.sending.baseline }}</div>
              <div class="data__info">Starting baseline</div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.settings.sending.increase_rate }}</div>
              <div class="data__info">Increase per day</div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.settings.sending.max_sends }}</div>
              <div class="data__info">Max sends per day</div>
            </div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.settings.sending.reply_rate }}%</div>
              <div class="data__info">Reply rate percentage</div>
            </div>
          </v-col>
        </v-row>
        <div class="data__title">
          About This Inbox
        </div>
        <v-divider class="mb-2 mt-1" />
        <v-row class="mb-13">
          <v-col cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.settings.about.provider_pretty }}</div>
              <div class="data__info">Inbox type</div>
            </div>
          </v-col>
          <v-col v-if="!isFreePlan" cols="6" md="3">
            <div class="data__wrapper">
              <div class="data__value">{{ inbox.domain.age_pretty }}</div>
              <div class="data__info">Domain age</div>
            </div>
          </v-col>
        </v-row>
        <div class="data__title">
          Delete Inbox
        </div>
        <v-divider class="mb-2 mt-1" />
        Delete this inbox by <a class="settings__delete-link" @click="$emit('delete')">clicking once here</a>.
        Note, when deleting the inbox you also delete all of your historical metrics.
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import EditScheduleModal from '@/components/modals/EditScheduleModal.vue'
import InboxControl from '@/components/InboxControl.vue'
import Inbox from '@/types/Inbox'
import SubscriptionPlan from '@/constants/SubscriptionPlan'
import AuthModule from '@/store/modules/AuthModule'

@Component({ components: { EditScheduleModal, InboxControl } })
export default class InboxSettings extends Vue {
  @Prop({
    type: Object as () => Inbox
  })
  readonly inbox!: Inbox

  get isFreePlan (): boolean {
    return AuthModule.plan === SubscriptionPlan.Free
  }
}
</script>

<style lang="scss" scoped>
  .settings {
    &__title {
      font-family: $label-font;
      font-size: $font-md-x;
      width: 100%;
      padding-left: 10px;
      .label {
        font-size: 15px;
        &__running {
          color: $color-mountain-meadow;
        }
        &__paused {
          color: $color-french-gray
        }
      }
    }
    &__data {
      font-family: $label-font;
      .data {
        &__wrapper {
          margin-bottom: 18px;
        }
        &__title {
          font-weight: $font-weight-bold;
          font-size: $font-md-x;
        }
        &__value {
          font-weight: $font-weight-bold;
          font-size: $font-lg;
        }
      }
    }
    &__delete-link {
      color: #d89a98;
      text-decoration: underline;
    }
  }
</style>
