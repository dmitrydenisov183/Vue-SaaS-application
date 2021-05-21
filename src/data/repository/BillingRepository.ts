import Client from '@/data/Client'
import AuthModule from '@/store/modules/AuthModule'
import BackendClientInterface from '@/types/BackendClientInterface'
import Billing from '@/types/Billing'
import BillingForm from '@/types/BillingForm'
import { FailureResponse } from '@/types/Response'
import { AxiosResponse } from 'axios'

export default class BillingRepository {
  private readonly client: BackendClientInterface
  private readonly apyKey: string = AuthModule.key

  constructor () {
    this.client = new Client()
  }

  async fetch (credits: number): Promise<AxiosResponse<Billing> | FailureResponse> {
    return this.client.get(`/billing/preview/${this.apyKey}/${credits}`)
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async save (form: BillingForm): Promise<AxiosResponse<{ status: string }> | FailureResponse> {
    return this.client.post('/billing/process/', { ...form, ...{ api_key: this.apyKey } })
      .catch(error => this.client.toErrorResponse(error))
  }
}
