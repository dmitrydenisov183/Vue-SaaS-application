import InboxRepository from '@/data/repository/InboxRepository'
import { EventBus } from '@/main'
import FlashMessage from '@/types/FlashMessage'
import Inbox from '@/types/Inbox'
import { FailureResponse, isFailureResponse } from '@/types/Response'
import { AxiosResponse } from 'axios'

export function appendUrlSearchParams (url: URL, params: { [key: string]: any }, prefix = '') {
  const name = (key: string) => prefix ? `${prefix}[${key}]` : key
  Object.keys(params)
    .filter((key: string) => params[key] !== null)
    .forEach((key: string) => {
      if (Array.isArray(params[key])) {
        params[key].forEach((item: any) => appendUrlSearchParams(url, { [`${key}[]`]: item }, prefix))
      } else {
        typeof params[key] === 'object'
          ? appendUrlSearchParams(url, params[key], name(key))
          : url.searchParams.append(name(key), params[key])
      }
    })
}

export function appendDataToUrlQueryString (url: string, base: string, data: { [key: string]: any }) {
  const obj = new URL(url, base)
  appendUrlSearchParams(obj, data)

  return obj.href
}

export function getErrorMessage (response: FailureResponse) {
  return response.reason ? response.reason : 'Something is gone wrong, please contact support'
}

export function sendFlashMessage (flash: FlashMessage): void {
  EventBus.$emit('flash-message', flash)
}

export function copyToClipboard (string: string) {
  const fullLink = document.createElement('input')
  document.body.appendChild(fullLink)
  fullLink.value = string
  fullLink.select()
  document.execCommand('copy', false)
  fullLink.remove()
}

export async function getEmailByInboxId (inboxId: string): Promise<string> {
  const response = await new InboxRepository().fetch(inboxId)
  return isFailureResponse(response) ? '' : (response as AxiosResponse<Inbox>).data.email
}

export function getCreditCardFormat (cardNumber: string): string {
  const formatted = cardNumber.replace(/\s/g, '').match(/.{1,4}/g)
  return formatted ? formatted.join(' ') : ''
}

export function getAmexCreditCardFormat (cardNumber: string): string {
  return cardNumber.replace(/\s/g, '').replace(/\b(\d{4})(\d{6})(\d{5})\b/, '$1 $2 $3')
}
