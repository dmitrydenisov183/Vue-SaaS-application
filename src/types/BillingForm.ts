export default interface BillingForm {
  new_seat_count: number;
  use_card_on_file: boolean;
  card_number: string | null;
  exp_month: string | null;
  exp_year: string | null;
  security_code: string | null;
  postal_code: string | null;
}
