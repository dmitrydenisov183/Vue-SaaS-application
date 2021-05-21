
export interface FailureResponse {
  status: string;
  reason: string;
}

export function isFailureResponse (response: any): boolean {
  return response.status && (response.status < 200 || response.status >= 300)
}

export function isSuccessfulResponse (response: any): boolean {
  return response.status && response.status >= 200 && response.status <= 204
}
