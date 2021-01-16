import { Flex, Text } from "@adobe/react-spectrum";
import React from "react";
import { Meal } from "../utils/model";

export default function MealItem({ children }: { children: Meal }) {
  return (
    <Flex justifyContent="space-between" flexGrow={1}>
      <Flex>
        <Text>{children.name}</Text>
      </Flex>
      <Flex>
        <Text>{children.calories} kcal</Text>
      </Flex>
    </Flex>
  );
}
