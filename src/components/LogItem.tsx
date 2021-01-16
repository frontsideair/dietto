import React from "react";
import { Text } from "@adobe/react-spectrum";
import { Log } from "../utils/model";

export default function LogItem({ children }: { children: Log }) {
  return (
    <Text>
      {children.portion} {children.meal.name}
    </Text>
  );
}
