import React from "react";
import { Flex, ProgressCircle, Text } from "@adobe/react-spectrum";

export default function Chart({
  value,
  maxValue,
}: {
  value: number;
  maxValue: number;
}) {
  return (
    <Flex direction="column">
      <ProgressCircle
        size="L"
        value={value}
        maxValue={maxValue}
        aria-label="calories consumed"
      />
      <Text>
        {value} / {maxValue}
      </Text>
    </Flex>
  );
}
