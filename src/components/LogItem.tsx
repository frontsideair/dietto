import React from "react";
import { Text } from "@adobe/react-spectrum";
import { Log } from "../utils/database";

export default function LogItem({ children }: { children: Log }) {
  // switch (children.type) {
  //   case "combination":
  return (
    <Text>
      {children.portion} {children.name}
    </Text>
  );
  //   case "raw":
  //     return (
  //       <Text>
  //         {children.weight}g {children.name}
  //       </Text>
  //     );
  // }
}
