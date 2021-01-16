import { useState } from "react";
import produce from "immer";
import superjson from "superjson";
import {
  Calories,
  DateString,
  DateTimeString,
  formatDate,
  Log,
  Meal,
  uuid,
  UUID,
} from "./model";
import { get } from "./utils";

function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  from: (_: string) => T,
  to: (_: T) => string
) {
  const [state, setState] = useState<T>(() => {
    const value = window.localStorage.getItem(key);
    return value ? from(value) : defaultValue;
  });
  function set(value: T | ((_: T) => T)) {
    const valueToStore = value instanceof Function ? value(state) : value;
    setState(valueToStore);
    window.localStorage.setItem(key, to(valueToStore));
  }
  return [state, set] as const;
}

export function useLimit() {
  return useLocalStorage("limit", 1000, (n) => Number.parseInt(n, 10), String);
}

type Logs = Map<DateString, Map<DateTimeString, Log>>;

export function useLogs() {
  return useLocalStorage<Logs>(
    "logs",
    new Map(),
    superjson.parse,
    superjson.stringify
  );
}

export function useDayLogs(day: Date) {
  const dayString = formatDate(day);
  const [logs, setLogs] = useLogs();
  const [meals] = useMeals();

  const dayLogs = get(logs, dayString, new Map());

  function addDayLog(
    mealId: string,
    portion: number,
    timestamp: DateTimeString
  ) {
    const { name, calories } = get(meals, mealId);
    setLogs(
      produce((draft: Logs) => {
        const dayLogs = get(draft, dayString, new Map());
        const log = {
          meal: { name, calories },
          portion,
          timestamp: timestamp,
        };
        dayLogs.set(timestamp, log);
        draft.set(dayString, dayLogs);
      })
    );
  }

  function deleteDayLog(log: Log) {
    setLogs(
      produce((draft: Logs) => {
        const dayLogs = get(draft, dayString);
        dayLogs.delete(log.timestamp);
      })
    );
  }

  return [dayLogs, addDayLog, deleteDayLog] as const;
}

type Meals = Map<UUID, Meal>;

export function useMeals() {
  const [meals, setMeals] = useLocalStorage<Meals>(
    "meals",
    new Map(),
    superjson.parse,
    superjson.stringify
  );

  function addMeal(name: string, calories: Calories) {
    setMeals(
      produce((draft: Meals) => {
        const id = uuid();
        draft.set(id, { id, name, calories });
      })
    );
  }

  function editMeal(id: string, name: string, calories: Calories) {
    setMeals(
      produce((draft: Meals) => {
        const meal = get(draft, id);
        meal.name = name;
        meal.calories = calories;
      })
    );
  }

  function deleteMeal(id: UUID) {
    setMeals(
      produce((draft: Meals) => {
        draft.delete(id);
      })
    );
  }
  return [meals, addMeal, editMeal, deleteMeal] as const;
}
