export default interface Billing {
  display_code: string;
  header_text: string;
  per_month_label: string;
  per_month_value: string;
  secondary_label: null | string;
  secondary_value: null | string;
  helper_text: string;
}
