import Client from '@/data/Client'
import AuthModule from '@/store/modules/AuthModule'
import BackendClientInterface from '@/types/BackendClientInterface'
import Inboxes from '@/types/Inboxes'
import { InboxForm } from '@/types/InboxForm'
import { FailureResponse } from '@/types/Response'
import Inbox from '@/types/Inbox'
import { AxiosResponse } from 'axios'
import ScheduleForm from '@/types/ScheduleForm'

export default class InboxRepository {
  private readonly client: BackendClientInterface
  private readonly apiKey: string = AuthModule.key

  constructor () {
    this.client = new Client()
  }

  async fetchAll (page: number): Promise<AxiosResponse<Inboxes> | FailureResponse> {
    return this.client.get(`inboxes/list/${this.apiKey}/${page}`)
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async fetch (inboxId: string): Promise<AxiosResponse<Inbox> | FailureResponse> {
    return this.client.get(`inboxes/details/${inboxId}`)
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async add (form: InboxForm): Promise<AxiosResponse<{ status: string; inbox_id: string }> | FailureResponse> {
    return this.client.post('inboxes/add', { ...form, ...{ api_key: this.apiKey } })
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async pause (inboxId: string): Promise<AxiosResponse<{ status: string }> | FailureResponse> {
    return this.client.post('inboxes/actions/pause', { inbox_id: inboxId, api_key: this.apiKey })
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async start (inboxId: string): Promise<AxiosResponse<{ status: string }> | FailureResponse> {
    return this.client.post('inboxes/actions/start', { inbox_id: inboxId, api_key: this.apiKey })
      .then(response => this.client.toDataResponse(response))
      .catch(error => this.client.toErrorResponse(error))
  }

  async delete (inboxId: string): Promise<AxiosResponse<{ status: string }> | FailureResponse> {
    return this.client.delete(`inboxes/${inboxId}`)
      .catch(error => this.client.toErrorResponse(error))
  }

  async editSchedule (form: ScheduleForm): Promise<{ status: string } | FailureResponse> {
    return this.client.post('inboxes/actions/reschedule', { ...form, ...{ api_key: this.apiKey } })
      .catch(error => this.client.toErrorResponse(error))
  }
}
