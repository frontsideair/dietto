import { formatISO, isSameDay, parseISO } from "date-fns";
import { useState } from "react";
import produce from "immer";
import { v4 as uuid } from "uuid";

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

export function useLogs(date: Date) {
  const [logs, setLogs] = useLocalStorage<Log[]>(
    "logs",
    [],
    JSON.parse,
    JSON.stringify
  );
  function addLog(meal: string, portion: number) {
    setLogs(
      produce((draft: Log[]) => {
        draft.push({
          mealId: meal,
          portion,
          timestamp: formatISO(new Date()),
        });
      })
    );
  }
  function editLog(log: Log, mealId: string, portion: number) {
    setLogs(
      produce((draft: Log[]) => {
        const maybeLog = draft.find((v) => v.timestamp === log.timestamp);
        if (maybeLog) {
          maybeLog.mealId = mealId;
          maybeLog.portion = portion;
        }
      })
    );
  }
  function deleteLog(log: Log) {
    setLogs((logs) => logs.filter((v: Log) => v.timestamp !== log.timestamp));
  }
  const dayLogs = logs.filter((log) =>
    isSameDay(parseISO(log.timestamp), date)
  );
  return [dayLogs, addLog, editLog, deleteLog] as const;
}

export function findMeal(mealId: string, meals: Meal[]) {
  const maybeMeal = meals.find((meal) => (meal.id = mealId));
  if (maybeMeal) {
    return maybeMeal;
  } else {
    throw new Error(`Meal ${mealId} not found!`);
  }
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
        draft.push({ id: uuid(), name, value: calories });
      })
    );
  }
  function editMeal(id: string, name: string, calories: number) {
    setMeals(
      produce((draft: Meal[]) => {
        const maybeMeal = draft.find((meal: Meal) => meal.id === id);
        if (maybeMeal) {
          maybeMeal.name = name;
          maybeMeal.value = calories;
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

export type IngredientType = { name: string; calories: Calories };

export type Meal = { id: string; name: string; value: Calories };

export type Log = {
  mealId: string;
  portion: number;
  timestamp: string;
};

// export function raw(name: string, weight: Grams): Log {
//   const timestamp = new Date().toISOString();
//   return { timestamp, name, type: "raw", weight };
// }

// export function combination(name: string, portion: number): Log {
//   const timestamp = new Date().toISOString();
//   return { timestamp, name, type: "combination", portion };
// }

// type Database = {
//   limit: Calories;
//   logs: Record<string, Log[]>;
//   meals: Record<string, Meal>;
//   ingredients: Record<string, Calories>;
// };

// const database: Database = {
//   limit: 750,
//   logs: {
//     "2020-09-20": [
//       // yumurtali yagli ekmek = 1 dilim ekmek + 3g tereyag + 1/2 yumurta sarisi
//       // kahvalti = 1 dilim ekmek + 30g peynir + 4 zeytin + 1 yumurta beyazi + 1/2 yumurta sarisi
//       // manti = 100g manti + 150g yogurt + 20g salca
//       // hamburger = 1 hamburger ekmek + 50g kiyma + 10g domates + 10g sogan
//       // piko = 18g piko (482 / 100 * 18)
//       // seftali = 1 seftali
//       // daba daba = 1 daba daba (410kcal)
//       {
//         timestamp: "2020-09-19T13:43:33.207Z",
//         type: "combination",
//         name: "yumurtali yagli ekmek",
//         portion: 1,
//       },
//       {
//         timestamp: "2020-09-19T16:43:33.207Z",
//         type: "raw",
//         name: "ekmek",
//         weight: 100,
//       },
//       {
//         timestamp: "2020-09-19T19:43:33.207Z",
//         type: "combination",
//         name: "piko",
//         portion: 1,
//       },
//     ],
//   },
//   meals: {
//     "yagli ekmek": [
//       { type: "raw", name: "yag", weight: 3 },
//       { type: "combination", name: "dilim ekmek", portion: 1 },
//     ],
//     "yumurtali yagli ekmek": [
//       { type: "combination", name: "yagli ekmek", portion: 1 },
//       { type: "combination", name: "yumurta sarisi", portion: 1 / 2 },
//     ],
//     "dilim ekmek": [{ type: "raw", name: "ekmek", weight: 50 }],
//     "piko": [{ type: "raw", name: "piko", weight: 18 }],
//     "daba daba": 409.17,
//     "yumurta sarisi": 55,
//   },
//   ingredients: {
//     yag: 700,
//     ekmek: 100,
//     piko: 482,
//     karpuz: 30,
//   },
// };

// export function calories(
//   eaten: Ingredient[],
//   meals: Record<string, Meal>,
//   ingredients: Record<string, Calories>
// ): Calories {
//   function mealCalories(meal: Meal): Calories {
//     if (typeof meal === "number") {
//       return meal;
//     } else {
//       return sum(map(ingredientCalories)(meal));
//     }
//   }

//   function ingredientCalories(ingredient: Ingredient): Calories {
//     switch (ingredient.type) {
//       case "raw":
//         return (ingredients[ingredient.name] * ingredient.weight) / 100;
//       case "combination":
//         return mealCalories(meals[ingredient.name]);
//     }
//   }

//   return sum(map(ingredientCalories)(eaten));
// }
