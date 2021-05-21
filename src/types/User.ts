import SubscriptionPlan from '@/constants/SubscriptionPlan'
import BillingCard from './BillingCard'
import InboxCapabilites from './InboxCapabilities'

export default interface User {
  data: {
    _id: string;
    api_key: string;
    team_key: string;
    first_name: string;
    last_name: string;
    intials: string;
    email: string;
    account_level: string;
    plan: SubscriptionPlan;
    plan_credits: number;
    avail_credits: number;
    inbox_capabilities: InboxCapabilites;
    billing: BillingCard;
    affilate: {
      shareable_code: string;
    };
    created: number;
    trial_ends: number;
    trial_ends_pretty: string;
    verified_account: boolean;
  };
}
