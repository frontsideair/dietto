import React from "react";
import { Text } from "@adobe/react-spectrum";
import { Log, useMeal } from "../utils/database";

export default function LogItem({ children }: { children: Log }) {
  const meal = useMeal(children.mealId);
  return (
    <Text>
      {children.portion} {meal.name}
    </Text>
  );
}
