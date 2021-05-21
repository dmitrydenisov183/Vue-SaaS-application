import InboxState from '@/constants/InboxState'

export default interface InboxSimple {
  inbox_id: string;
  email: string;
  status: InboxState;
  provider_pretty: string;
}
