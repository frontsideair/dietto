import { formatISO, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
import produce from "immer";
import { v4 as uuid } from "uuid";
import { map, sum } from "ramda";

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
  return useLocalStorage("limit", 1000, parseInt, String);
}

export function getDayLogs(logs: Log[], date: Date) {
  return logs.filter((log) => isSameDay(parseISO(log.timestamp), date));
}

export function useLogs() {
  const [logs, setLogs] = useLocalStorage<Log[]>(
    "logs",
    [],
    JSON.parse,
    JSON.stringify
  );
  const [meals] = useMeals();
  function addLog(mealId: string, portion: number) {
    const { name, calories } = findMeal(mealId, meals);
    setLogs(
      produce((draft: Log[]) => {
        draft.push({
          meal: { name, calories },
          portion,
          timestamp: formatISO(new Date()),
        });
      })
    );
  }
  function deleteLog(log: Log) {
    setLogs((logs) => logs.filter((v: Log) => v.timestamp !== log.timestamp));
  }
  return [logs, addLog, deleteLog] as const;
}

export function findMeal(mealId: string, meals: Meal[]) {
  const maybeMeal = meals.find((meal) => (meal.id = mealId));
  if (maybeMeal) {
    return maybeMeal;
  } else {
    throw new Error(`Meal ${mealId} not found!`);
  }
}

export function calculateCalories(logs: Log[], meals: Meal[]) {
  return sum(map((log) => log.meal.calories * log.portion, logs));
}

export function useMeal(mealId: string) {
  const [meals] = useMeals();
  return findMeal(mealId, meals);
}

export function useMeals() {
  const [meals, setMeals] = useLocalStorage<Meal[]>(
    "meals",
    [],
    JSON.parse,
    JSON.stringify
  );
  function addMeal(name: string, calories: number) {
    setMeals(
      produce((draft) => {
        draft.push({ id: uuid(), name, calories });
      })
    );
  }
  function editMeal(id: string, name: string, calories: number) {
    setMeals(
      produce((draft: Meal[]) => {
        const maybeMeal = draft.find((meal: Meal) => meal.id === id);
        if (maybeMeal) {
          maybeMeal.name = name;
          maybeMeal.calories = calories;
        }
      })
    );
  }
  function deleteMeal(id: string) {
    setMeals((meals) => meals.filter((meal: Meal) => meal.id !== id));
  }
  return [meals, addMeal, editMeal, deleteMeal] as const;
}

type Calories = number;

export type Meal = { id: string; name: string; calories: Calories };

export type Log = {
  meal: {
    name: string;
    calories: Calories;
  };
  portion: number;
  timestamp: string;
};
