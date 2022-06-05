import { ActionButton, Button, Flex, View } from "@adobe/react-spectrum";
import { startOfToday, subDays } from "date-fns";
import { useLogs } from "../utils/database";
import { range } from "ramda";
import { logsCalories } from "../utils/model";
import { formatDate, formatDateHumanReadable, get } from "../utils";
import List from "../components/List";
import { useState } from "react";
import Day from "../components/Day";

function getWeek(date: Date) {
  return range(0, 7).map((diff) => subDays(date, diff));
}

function Calories(props: { children: number }) {
  const calories = props.children;
  return <View>{calories}</View>;
}

export default function Days() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [logs] = useLogs();

  const today = startOfToday();
  const week = getWeek(today);
  const data = week.map((day) => ({
    x: day,
    y: logsCalories([...get(logs, formatDate(day), new Map()).values()]),
  }));

  return (
    <Flex direction="column">
      {selectedDay ? (
        <>
          <Button variant="cta" onPress={() => setSelectedDay(null)}>
            Go back
          </Button>
          <Day date={selectedDay} />
        </>
      ) : (
        <List items={data}>
          {(item) => (
            <ActionButton
              key={item.x.toString()}
              isQuiet
              onPress={() => setSelectedDay(item.x)}
            >
              <Flex justifyContent="space-between" flexGrow={1}>
                <View>{formatDateHumanReadable(item.x)}</View>{" "}
                <Calories>{item.y}</Calories>
              </Flex>
            </ActionButton>
          )}
        </List>
      )}
    </Flex>
  );
}
