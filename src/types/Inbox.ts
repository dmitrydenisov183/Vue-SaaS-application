import InboxState from '@/constants/InboxState'

export default interface Inbox {
  inbox_id: string;
  email: string;
  status: InboxState;
  sending: {
    today: number;
    last_7: number;
    last_30: number;
  };
  receiving: {
    today: number;
    last_7: number;
    last_30: number;
  };
  inbox_v_spam: {
    inbox_count: number;
    inbox_percent: number | null;
    spam_count: number;
    spam_percent: number | null;
  };
  basic_health: {
    score: number;
    out_of: number;
    last_checked_string: string;
  };
  blacklists: {
    count: string;
    last_checked_string: string;
  };
  settings: {
    sending: {
      baseline: number;
      increase_rate: number;
      max_sends: number;
      reply_rate: number;
    };
    about: {
      provider_pretty: string;
    };
  };
  domain: {
    age_pretty: string;
  };
  chart: {
    [key: string]: {
      scheduled: number;
      inbox: number;
      spam: number;
      unix_start: number;
      unix_end: number;
    };
  }[];
}
