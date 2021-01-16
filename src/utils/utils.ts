import { formatISO, parseISO } from "date-fns";
import { DateString, DateTimeString } from "./model";

export function get<K, V>(map: Map<K, V>, key: K, defaultValue?: V): V {
  const value = map.get(key);
  if (value !== undefined) {
    return value;
  } else {
    if (defaultValue) {
      return defaultValue;
    } else {
      throw new Error(`Key ${key} not found in map!`);
    }
  }
}

export function formatDate(date: Date): DateString {
  return formatISO(date, { representation: "date" }) as DateString;
}

export function formatDateTime(date: Date): DateTimeString {
  return formatISO(date, { representation: "complete" }) as DateTimeString;
}

export function parseDate(dateString: DateString | DateTimeString): Date {
  return parseISO(dateString);
}
