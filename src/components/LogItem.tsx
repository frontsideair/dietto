import React from "react";
import { Flex, Text } from "@adobe/react-spectrum";
import { Log } from "../utils/model";

export default function LogItem({ children }: { children: Log }) {
  return (
    <Flex justifyContent="space-between" flexGrow={1}>
      <Flex>
        <Text>
          {children.portion} {children.meal.name}
        </Text>
      </Flex>
      <Flex>
        <Text>{children.portion * children.meal.calories} kcal</Text>
      </Flex>
    </Flex>
  );
}
