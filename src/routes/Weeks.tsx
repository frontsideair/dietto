import { useState } from "react";
import { ActionButton, Button, Flex, View } from "@adobe/react-spectrum";
import {
  eachDayOfInterval,
  endOfWeek,
  isToday,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { useLogs } from "../utils/database";
import { logsCalories } from "../utils/model";
import { formatDate, formatDateHumanReadable, get } from "../utils";
import List from "../components/List";
import Day from "../components/Day";

function getWeek(date: Date) {
  return eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  });
}

function Calories(props: { children: number }) {
  const calories = props.children;
  return <View>{calories}</View>;
}

export default function Weeks() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [logs] = useLogs();

  const today = startOfToday();
  const week = getWeek(today);
  const data = week.map((day) => ({
    day,
    calories: logsCalories([...get(logs, formatDate(day), new Map()).values()]),
  }));
  const daysWithData = data.filter((day) => day.calories > 0);
  const average = Math.floor(
    daysWithData.reduce((acc, { calories }) => acc + calories, 0) /
      daysWithData.length
  );

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
        <>
          <List items={data}>
            {(item) => (
              <ActionButton
                key={item.day.toString()}
                isQuiet
                onPress={() => setSelectedDay(item.day)}
              >
                <Flex justifyContent="space-between" flexGrow={1}>
                  <View>
                    {formatDateHumanReadable(item.day)}{" "}
                    {isToday(item.day) ? "(Today)" : ""}
                  </View>{" "}
                  <Calories>{item.calories}</Calories>
                </Flex>
              </ActionButton>
            )}
          </List>
          <View>
            Weekly average: {Number.isFinite(average) ? average : "no data"}
          </View>
        </>
      )}
    </Flex>
  );
}
