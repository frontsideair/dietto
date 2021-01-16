import { v4 } from "uuid";

type Opaque<K, T> = T & { __TYPE__: K };

export type DateTimeString = Opaque<"DateTimeString", string>;
export type DateString = Opaque<"DateString", string>;
export type UUID = Opaque<"UUID", string>;

export type Calories = Opaque<"Calories", number>;

export type Meal = { id: UUID; name: string; calories: Calories };

export function uuid(): UUID {
  return v4() as UUID;
}

export type Log = {
  id: UUID;
  meal: {
    name: string;
    calories: Calories;
  };
  portion: number;
};

export function calculateCalories(logs: Log[]): Calories {
  return logs.reduce(
    (acc: Calories, log: Log) =>
      (acc + log.meal.calories * log.portion) as Calories,
    0 as Calories
  );
}
