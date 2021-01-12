import { endOfDay, startOfDay } from "date-fns";
// import { sum, map } from "ramda";

import { useDB, useFind, useGet } from "react-pouchdb/browser";

// ingredient = calories per unit (like flour, oil etc)
// meal = ready or combination
// ready = calories per unit (pieces?)
// combination = list of ingredients with quantity
// log = meal with portion with timestamp

// type T = [number, (limit: number) => void];
export function useLimit() {
  const LIMIT_ID = "limit";
  const doc = useGet<{ value: number }>({ id: LIMIT_ID });
  const db = useDB();
  function setLimit(value: number) {
    db.put({ _id: LIMIT_ID, _rev: doc?._rev, value });
  }
  return [doc?.value ?? 1000, setLimit] as const;
}

export function useLogs(date: Date) {
  const logs = useFind<Log>({
    selector: {
      type: "log",
      timestamp: { $gte: startOfDay(date), $lt: endOfDay(date) },
    },
  });
  const db = useDB();
  function addLog(meal: string, portion: number) {
    return db.post({
      type: "log",
      name: meal,
      portion,
      timestamp: new Date(),
    });
  }
  function editLog(
    log: PouchDB.Core.RemoveDocument,
    meal: string,
    portion: number
  ) {
    return db.put({ ...log, name: meal, portion });
  }
  function deleteLog(log: PouchDB.Core.RemoveDocument) {
    return db.remove(log);
  }
  return [logs, addLog, editLog, deleteLog] as const;
}

export function useMeals() {
  const meals = useFind<Meal>({
    selector: {
      type: "meal",
    },
  });
  const db = useDB();
  function addMeal(name: string, calories: number) {
    return db.post({
      type: "meal",
      name,
      value: calories,
    });
  }
  function editMeal(
    meal: PouchDB.Core.RemoveDocument,
    name: string,
    calories: number
  ) {
    return db.put({
      ...meal,
      name,
      value: calories,
    });
  }
  function deleteMeal(meal: PouchDB.Core.RemoveDocument) {
    return db.remove(meal);
  }
  return [meals, addMeal, editMeal, deleteMeal] as const;
}

export function useIngredients() {
  const meals = useFind<IngredientType>({
    selector: {
      type: "ingredient",
    },
  });
  const db = useDB();
  function addIngredient(name: string, calories: number) {
    return db.post({
      type: "ingredient",
      name,
      calories,
    });
  }
  function editIngredient(
    ingredient: PouchDB.Core.RemoveDocument,
    name: string,
    calories: number
  ) {
    return db.put({
      ...ingredient,
      name,
      calories,
    });
  }
  function deleteIngredient(ingredient: PouchDB.Core.RemoveDocument) {
    return db.remove(ingredient);
  }
  return [meals, addIngredient, editIngredient, deleteIngredient] as const;
}

type Calories = number;

type Grams = number;

type Raw = {
  type: "raw";
  name: string;
  weight: Grams;
};

type Combination = {
  type: "combination";
  name: string;
  portion: number;
};

type Ingredient = Raw | Combination;

export type IngredientType = { name: string; calories: Calories };

export type Meal = { name: string; value: Calories };

export type Log = {
  name: string;
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
