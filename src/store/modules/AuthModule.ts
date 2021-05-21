import { Module, Action, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import Cookies from 'js-cookie'
import store from '@/store/index'
import { AxiosResponse } from 'axios'
import UserRepository from '@/data/repository/UserRepository'
import User from '@/types/User'
import { isFailureResponse } from '@/types/Response'
import InboxCapabilites from '@/types/InboxCapabilities'
import BillingCard from '@/types/BillingCard'
import SubscriptionPlan from '@/constants/SubscriptionPlan'

@Module({
  name: 'auth',
  dynamic: true,
  namespaced: true,
  store
})
export class AuthModule extends VuexModule {
  key: string = Cookies.get('authKey') || ''
  user: User | null = null

  get isAccountVerified (): boolean {
    return !!this.user && this.user.data.verified_account
  }

  get isAuthenticated (): boolean {
    return !!this.key
  }

  get inboxCapabilities (): InboxCapabilites | null {
    return this.user && this.user.data.inbox_capabilities
  }

  get shareableCode (): string | null {
    return this.user && this.user.data.affilate.shareable_code
  }

  get userId (): string | null {
    return this.user && this.user.data._id
  }

  get planCredits (): number | null {
    return this.user && this.user.data.plan_credits
  }

  get availableCredits (): number | null {
    return this.user && this.user.data.avail_credits
  }

  get trialEndsPretty (): string | null {
    return this.user && this.user.data.trial_ends_pretty
  }

  get plan (): SubscriptionPlan | null {
    return this.user && this.user.data.plan
  }

  get cardOnFile (): BillingCard | null {
    return this.user && this.user.data.billing
  }

  get userEmail (): string | null {
    return this.user && this.user.data.email
  }

  get firstName (): string | null {
    return this.user && this.user.data.first_name
  }

  get lastName (): string | null {
    return this.user && this.user.data.last_name
  }

  @Action({ rawError: true })
  async login (response: AxiosResponse<{ status: string; key: string }>): Promise<void> {
    this.context.commit('authSuccess', response)
  }

  @Action({ rawError: true })
  async getUser (): Promise<boolean> {
    const userResponse = await new UserRepository().fetch()

    if (isFailureResponse(userResponse)) {
      return false
    }

    this.context.commit('setInboxCapabilities', (userResponse as AxiosResponse<User>).data)

    return true
  }

  @Action({ rawError: true })
  logout (): void {
    this.context.commit('authLogout')
  }

  @Mutation
  setInboxCapabilities (user: User) {
    this.user = user
  }

  @Mutation
  authSuccess (response: AxiosResponse<{ status: string; key: string }>) {
    Cookies.set(
      'authKey',
      (response as AxiosResponse<{ status: string; key: string }>).data.key,
      {
        domain: location.hostname,
        sameSite: 'strict'
      }
    )
  }

  @Mutation
  authLogout () {
    Cookies.remove(
      'authKey',
      {
        domain: location.hostname,
        sameSite: 'strict'
      }
    )
  }
}

export default getModule(AuthModule)
