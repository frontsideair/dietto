import React from "react";
import { Flex, Button, View } from "@adobe/react-spectrum";
import ChevronLeft from "@spectrum-icons/workflow/ChevronLeft";
import ChevronRight from "@spectrum-icons/workflow/ChevronRight";
import { addDays, isSameDay, startOfToday, subDays } from "date-fns";
import formatDay from "../utils/formatDay";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function Datepicker({ date, setDate }: Props) {
  return (
    <Flex>
      <Button
        variant="secondary"
        onPress={(event) => setDate(subDays(date, 1))}
      >
        <ChevronLeft />
      </Button>
      <View flexGrow={1}>{formatDay(date)}</View>
      <Button
        variant="secondary"
        isDisabled={isSameDay(date, startOfToday())}
        onPress={(event) => setDate(addDays(date, 1))}
      >
        <ChevronRight />
      </Button>
    </Flex>
  );
}
