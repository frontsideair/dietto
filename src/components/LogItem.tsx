import React from "react";
import { Text } from "@adobe/react-spectrum";
import { Log } from "../utils/database";

export default function LogItem({ children }: { children: Log }) {
  return (
    <Text>
      {children.portion} {children.meal.name}
    </Text>
  );
}
