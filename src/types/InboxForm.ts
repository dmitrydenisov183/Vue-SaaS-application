import EmailProvider from '@/constants/EmailProvider'

export interface InboxForm {
  provider: EmailProvider;
  email: string;
  password: string;
  sender_first: string;
  sender_last: string;
  smtp_username: string | null;
  smtp_password: string | null;
  smtp_host: string | null;
  smtp_port: string | null;
  smtp_ssl: boolean;
  imap_username: string | null;
  imap_password: string | null;
  imap_host: string | null;
  imap_port: string | null;
  imap_ssl: boolean;
  starting_baseline: string;
  increase_per_day: string;
  max_sends_per_day: string;
  reply_rate_percent: string;
}
