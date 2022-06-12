import { Flex, Text } from "@adobe/react-spectrum";
import { logCalories, Log } from "../utils/model";

export default function LogItem({ children }: { children: Log }) {
  const portion = children.portion ? `(${children.portion})` : "";
  return (
    <Flex justifyContent="space-between" flexGrow={1}>
      <Flex>
        <Text>
          {children.meal.name} {portion}
        </Text>
      </Flex>
      <Flex>
        <Text>{logCalories(children)} kcal</Text>
      </Flex>
    </Flex>
  );
}
