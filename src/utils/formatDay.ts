import { format } from "date-fns";

export type DayString = string;

export default function formatDay(date: Date): DayString {
  return format(date, "yyyy-MM-dd");
}
