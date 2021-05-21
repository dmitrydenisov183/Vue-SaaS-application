<template>
  <div class="inboxes d-flex justify-space-between flex-column">
    <div>
      <div class="inboxes__title pb-3">Inboxes</div>
      <v-divider class="pb-3"></v-divider>
      <div class="px-2">
        Thanks for signing up for Warmup Inbox! Get started by adding an inbox. If you get stuck just
        <a :href="`mailto:${supportEmail}`">let us know</a>.
      </div>
      <div class="px-2 pt-5 inboxes__modal-wrapper">
        <add-inbox-modal @created="$emit('created')" />
      </div>
    </div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="4">
          <div class="help-text border-right" :class="{'no-border': $vuetify.breakpoint.sm || $vuetify.breakpoint.xs}">
            <div class="mb-2 font-weight-bold">How Does This All Work?</div>
            <div>
              Building up and maintain a positive sending reputation is a complicated process.
              Thankfully we built an effortless way to keep your deliverability high. Learn how we do it.
            </div>
            <base-button
              :href="`${baseUrl}/how-it-works`"
              target="blank"
              class="help-text__action text-capitalize mt-5"
              small
            >
              Learn more
            </base-button>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="help-text border-right" :class="{'no-border': $vuetify.breakpoint.sm || $vuetify.breakpoint.xs}">
            <div class="mb-2 font-weight-bold">ABW: Always Be Warming</div>
            <div>
              Maintaining consistent positive engagement within your inboxes is critical for upholding the highest
              possible delivery rates for your emails.
            </div>
            <base-button
              :href="`${baseUrl}/always-be-warming-up-your-inbox`"
              target="blank"
              class="help-text__action text-capitalize mt-5"
              small
            >
              Learn why
            </base-button>
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <div class="help-text">
            <div class="mb-2 font-weight-bold">Refer A Friend, Make $ Each Month</div>
            <div>
              You can earn a 20% commission every month for every customer you refer. Use your unique link below so
              you can share on your blog, podcast, etc…
            </div>
            <base-button
              to="#"
              class="help-text__action text-capitalize mt-5"
              small
              @click="onCopyLink"
            >
              Copy Referral Link
            </base-button>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AddInboxModal from '@/components/modals/AddInboxModal.vue'
import { copyToClipboard, sendFlashMessage } from '@/utils/misc'
import AuthModule from '@/store/modules/AuthModule'

@Component({ components: { AddInboxModal } })
export default class EmptyInboxes extends Vue {
  get supportEmail () {
    return process.env.VUE_APP_SUPPORT_EMAIL
  }

  get baseUrl (): string {
    return process.env.VUE_APP_BASE_URL
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
}
</script>

<style lang="scss" scoped>
  .inboxes {
    background-color: #FFFFFF;
    width: 100%;
    height: 100%;
    &__title {
      font-size: $font-lg;
      font-weight: $font-weight-bold;
    }
    &__new {
      font-size: $font-xs-x;
    }
    &__modal-wrapper::v-deep {
      div[role=button] {
        max-width: min-content !important;
      }
    }

    .help-text {
      padding: 0 10%;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: space-between;
      &.border-right {
        border-right: 1px solid #F0F0F0;
      }
      &.no-border {
        border: none !important;
      }
      &__action {
        font-size: $font-xs-x;
        align-self: baseline;
      }
    }
  }
</style>
