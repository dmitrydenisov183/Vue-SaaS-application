<template>
  <div class="dashboard ml-md-12 ml-0">
    <v-app-bar class="header" height="50px" app flat>
      <v-container fluid>
        <v-row class="header__row">
          <v-col cols="6" sm="4" class="d-flex align-center header__col">
            <img src="@/assets/img/logo_white.png" width="20px" @click.stop="sidebar = !sidebar">
          </v-col>
          <v-col cols="6" sm="4" class="d-none d-sm-block header__col">
            <div v-if="title" class="header__title white--text text-center">
              <template v-if="title.icon === 'mdi-inbox-outline'">
                <span class="header__icon d-inline-block">
                  <svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                      <g id="/inboxes-(No-Data)" transform="translate(-22.000000, -92.000000)">
                        <path d="M33.9,103.9 L33.9,103.05 C33.9,102.5808 34.2808,102.2 34.75,102.2 L37.3,102.2 L37.3,106.45 C37.3,106.9192 36.9192,107.3 36.45,107.3 L24.55,107.3 C24.0808,107.3 23.7,106.9192 23.7,106.45 L23.7,102.2 L26.25,102.2 C26.7192,102.2 27.1,102.5808 27.1,103.05 L27.1,103.9 C27.1,104.83925 27.86075,105.6 28.8,105.6 L32.2,105.6 C33.13925,105.6 33.9,104.83925 33.9,103.9 L33.9,103.9 Z M32.2,102.2 L32.2,103.9 L28.8,103.9 L28.8,102.2 C28.8,101.26075 28.03925,100.5 27.1,100.5 L23.7,100.5 L25.06,93.7 L35.94,93.7 L37.3,100.5 L33.9,100.5 C32.96075,100.5 32.2,101.26075 32.2,102.2 L32.2,102.2 Z M39,100.5 L37.43685,92.6834 C37.35695,92.2856 37.00845,92 36.603,92 L24.397,92 C23.99155,92 23.64305,92.2856 23.56315,92.6834 L22,100.5 L22,107.3 C22,108.23925 22.76075,109 23.7,109 L37.3,109 C38.23925,109 39,108.23925 39,107.3 L39,100.5 Z" id="inbox_empty_round-[#1553]"></path>
                      </g>
                    </g>
                  </svg>
                </span>
              </template>
              <template v-else>
                <base-icon class="pr-1" variant="secondary">
                  {{ title.icon }}
                </base-icon>
              </template>
              {{ title.title }}
              <template v-if="title.subTitle">
                - <span class="grey--text">{{ title.subTitle }}</span>
              </template>
            </div>
          </v-col>
          <v-col cols="6" sm="4" class="d-flex align-center justify-end header__col">
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <div class="d-flex justify-space-between align-center">
                  <subscribe-modal v-if="!hasSubscription" :billing="billing" link-variant="danger" @updated="onUpdate" />
                  <v-btn
                    class="align-items-center white--text"
                    variant="secondary"
                    v-bind="attrs"
                    v-on="on"
                    elevation="0"
                    text
                  >
                    {{ initials }}
                    <base-icon class="pl-0 pr-0 pt-0 pb-0" variant="secondary" size="14">mdi-chevron-down</base-icon>
                  </v-btn>
                </div>
              </template>
              <v-list class="menu">
                <v-list-item to="/account-settings" link>
                  Account
                </v-list-item>
                <v-list-item @click="onLogout" link>
                  Log out
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>
    <div class="dashboard__content d-flex">
      <v-navigation-drawer
        v-model="sidebar"
        with="50"
        :permanent="$vuetify.breakpoint.mdAndUp"
        absolute
        left
      >
        <v-list-item class="sidebar px-0 justify-space-between flex-column">
          <v-list-item-content>
            <v-list-item-icon class="mx-0">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <base-button
                    to="/inboxes"
                    class="mx-auto"
                    :variant="isActiveRoute('inboxes') ? 'black' : 'text'"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <svg width="17px" height="17px" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd">
                        <g id="/inboxes-(No-Data)" transform="translate(-22.000000, -92.000000)">
                          <path d="M33.9,103.9 L33.9,103.05 C33.9,102.5808 34.2808,102.2 34.75,102.2 L37.3,102.2 L37.3,106.45 C37.3,106.9192 36.9192,107.3 36.45,107.3 L24.55,107.3 C24.0808,107.3 23.7,106.9192 23.7,106.45 L23.7,102.2 L26.25,102.2 C26.7192,102.2 27.1,102.5808 27.1,103.05 L27.1,103.9 C27.1,104.83925 27.86075,105.6 28.8,105.6 L32.2,105.6 C33.13925,105.6 33.9,104.83925 33.9,103.9 L33.9,103.9 Z M32.2,102.2 L32.2,103.9 L28.8,103.9 L28.8,102.2 C28.8,101.26075 28.03925,100.5 27.1,100.5 L23.7,100.5 L25.06,93.7 L35.94,93.7 L37.3,100.5 L33.9,100.5 C32.96075,100.5 32.2,101.26075 32.2,102.2 L32.2,102.2 Z M39,100.5 L37.43685,92.6834 C37.35695,92.2856 37.00845,92 36.603,92 L24.397,92 C23.99155,92 23.64305,92.2856 23.56315,92.6834 L22,100.5 L22,107.3 C22,108.23925 22.76075,109 23.7,109 L37.3,109 C38.23925,109 39,108.23925 39,107.3 L39,100.5 Z" id="inbox_empty_round-[#1553]"></path>
                        </g>
                      </g>
                    </svg>
                  </base-button>
                </template>
                <span>Inboxes</span>
              </v-tooltip>
            </v-list-item-icon>
            </v-list-item-content>
            <v-list-item-content class="py-0 align-content-end">
            <v-list-item-icon class="mx-0">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <base-button
                    id="someId"
                    to="/billing"
                    class="mx-auto"
                    :variant="isActiveRoute('billing') ? 'black' : 'text'"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <base-icon >mdi-label-outline mdi-rotate-270</base-icon>
                  </base-button>
                </template>
                <span>Billing</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-icon class="mx-0">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <base-button
                    to="/account-settings"
                    class="mx-auto"
                    :variant="isActiveRoute('account-settings') ? 'black' : 'text'"
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <base-icon >mdi-account-outline</base-icon>
                  </base-button>
                </template>
                <span>Account Settings</span>
              </v-tooltip>
            </v-list-item-icon>
            <v-list-item-icon class="mx-0 mb-0">
              <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                  <base-button
                    class="mx-auto"
                    variant="text"
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click="onLogout"
                  >
                    <base-icon >mdi-exit-to-app</base-icon>
                  </base-button>
                </template>
                <span>Log out</span>
              </v-tooltip>
            </v-list-item-icon>
          </v-list-item-content>
        </v-list-item>
      </v-navigation-drawer>

      <router-view />

    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AuthModule from '@/store/modules/AuthModule'
import FlashMessage from '@/components/FlashMessage.vue'
import { getErrorMessage, sendFlashMessage } from '@/utils/misc'
import SubscriptionPlan from '@/constants/SubscriptionPlan'
import SubscribeModal from '@/components/modals/SubscribeModal.vue'
import RequestStatus from '@/constants/RequestStatus'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import BillingRepository from '@/data/repository/BillingRepository'
import { AxiosResponse } from 'axios'
import Billing from '@/types/Billing'
import SubscriptionState from '@/constants/SubscriptionState'
import { EventBus } from '@/main'
import Cookies from 'js-cookie'

@Component({ components: { FlashMessage, SubscribeModal } })
export default class TheDashboard extends Vue {
  sidebar = null
  status: RequestStatus = RequestStatus.Initial
  billing: Billing | null = null
  inboxEmail = ''

  isActiveRoute (route: string): boolean {
    return this.$route.name === route
  }

  get hasSubscription (): boolean {
    return (!!AuthModule.plan && AuthModule.plan !== SubscriptionPlan.Free) ||
      (!!this.billing && this.billing.display_code === SubscriptionState.Resubscribe)
  }

  get initials (): string {
    return `
      ${AuthModule.firstName ? AuthModule.firstName[0] : ''}${AuthModule.lastName ? AuthModule.lastName[0] : ''}
    `
  }

  get title (): { icon: string; title: string; subTitle: any } | undefined {
    switch (this.$route.name) {
      case 'inboxes':
        return {
          icon: 'mdi-inbox-outline',
          title: 'Inboxes',
          subTitle: this.$route.params.inbox
        }
      case 'inbox-details':
        return {
          icon: 'mdi-inbox-outline',
          title: 'Inboxes',
          subTitle: this.inboxEmail
        }
      case 'account-settings':
        return {
          icon: 'mdi-account-outline',
          title: 'Account Details',
          subTitle: 'Settings'
        }
      case 'billing':
        return {
          icon: 'mdi-label-outline mdi-rotate-270',
          title: 'Billing',
          subTitle: 'Settings'
        }
    }
  }

  get isLoading (): boolean {
    return this.status === RequestStatus.Loading
  }

  get planCredits (): number | null {
    return AuthModule.planCredits ? AuthModule.planCredits : 1
  }

  async fetch (): Promise<void> {
    if (this.isLoading || (this.planCredits === null)) return

    this.status = RequestStatus.Loading

    const response = await new BillingRepository().fetch(this.planCredits)

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

  async onUpdate (): Promise<void> {
    await AuthModule.getUser()
    this.fetch()
    sendFlashMessage({
      status: 'success',
      message: 'Your changes were successfully made.'
    })
  }

  onLogout (): void {
    AuthModule.logout()
    EventBus.$emit('closeDriftConnection')
  }

  async mounted () {
    this.fetch()

    await AuthModule.getUser()

    if (this.$route.meta.verifyRequired && !AuthModule.isAccountVerified) {
      this.$router.push({ path: '/email-verification', replace: true })
    }

    EventBus.$on('inboxEmail', (email: string) => {
      this.inboxEmail = email
    })

    EventBus.$emit('driftData', {
      id: AuthModule.userId,
      name: `${AuthModule.firstName}  ${AuthModule.lastName}`,
      email: AuthModule.userEmail,
      plan: AuthModule.plan,
      apiKey: Cookies.get('authKey') || ''
    })
  }
}
</script>

<style lang="scss" scoped>
  .alert-wrapper {
    position: absolute;
    width: 100%;
  }
  .dashboard {
    height: 100%;
    &__content {
      height: inherit;
    }
  }

  .header {
    background-color: $secondary-color !important;
    &__row {
      max-height: 50px;
    }
    &__col {
      max-height: 50px;
    }
    ::v-deep {
      .v-toolbar__content {
        padding: 0px !important;
      }
    }
    &__icon {
      padding: 5px;
      vertical-align: sub;
      svg {
        fill: #FFFFFF;
      }
    }
    &__title {
      font-family: $base-font;
      font-weight: bold;
      min-width: max-content;
      i {
        padding: 0 !important;
      }
    }
  }

  aside {
    position: fixed;
    padding-top: 50px;
    max-width: 50px;
    .v-btn--icon.v-size--default {
      height: 30px;
      width: 30px;
      i {
        font-size: $font-lg;
      }
    }
  }

  .sidebar {
    height: 100%;
    background-color: $bg-color;
  }

  .v-tooltip__content {
    font-size: $font-xs-x !important;
    line-height: 12px;
    background-color: $secondary-color !important;
  }

  .v-tooltip__content.menuable__content__active {
    opacity: 1 !important;
  }
</style>
