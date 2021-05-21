export default interface ScheduleForm {
  inbox_id: string;
  starting_baseline: number;
  increase_per_day: number;
  max_sends_per_day: number;
  reply_rate_percent: number;
}
