import { formatISO, parseISO } from "date-fns";
import { v4 } from "uuid";

type Opaque<K, T> = T & { __TYPE__: K };

export type DateTimeString = Opaque<"DateTimeString", string>;
export type DateString = Opaque<"DateString", string>;
export type UUID = Opaque<"UUID", string>;

export function formatDate(date: Date): DateString {
  return formatISO(date, { representation: "date" }) as DateString;
}

export function formatDateTime(date: Date): DateTimeString {
  return formatISO(date, { representation: "complete" }) as DateTimeString;
}

export function parseDate(dateString: DateString | DateTimeString): Date {
  return parseISO(dateString);
}

export type Calories = Opaque<"Calories", number>;

export type Meal = { id: UUID; name: string; calories: Calories };

export function uuid(): UUID {
  return v4() as UUID;
}

export type Log = {
  meal: {
    name: string;
    calories: Calories;
  };
  portion: number;
  timestamp: DateTimeString;
};

export function calculateCalories(logs: Log[]): Calories {
  return logs.reduce(
    (acc: Calories, log: Log) =>
      (acc + log.meal.calories * log.portion) as Calories,
    0 as Calories
  );
}
