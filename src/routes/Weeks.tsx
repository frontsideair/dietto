import { useState, useRef, FormEvent } from "react";
import {
  Button,
  Flex,
  Heading,
  View,
  Text,
  DialogTrigger,
  ActionButton,
  Dialog,
  Divider,
  Content,
  Form,
  TextField,
} from "@adobe/react-spectrum";
import { FixedSizeList } from "react-window";
import {
  eachDayOfInterval,
  endOfWeek,
  isToday,
  startOfToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useRect } from "@reach/rect";
import { useLogs, useWeeklyWeight } from "../utils/database";
import { logsCalories } from "../utils/model";
import { formatDate, formatDateHumanReadable, formatWeek, get } from "../utils";
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

type Props = {
  day: Date;
  setSelectedDay: (day: Date) => void;
  style: React.CSSProperties;
};

function Week({ day, setSelectedDay, style }: Props) {
  const [logs] = useLogs();
  const week = getWeek(day);
  const data = week.map((day) => ({
    day,
    calories: logsCalories([...get(logs, formatDate(day), new Map()).values()]),
  }));
  const daysWithData = data.filter((day) => day.calories > 0);
  const average = Math.floor(
    daysWithData.reduce((acc, { calories }) => acc + calories, 0) /
      daysWithData.length
  );
  const weekString = formatWeek(day);
  const [weight, logWeight] = useWeeklyWeight(weekString);

  return (
    <div style={style}>
      <Heading>{`${weekString} week`}</Heading>
      <List items={data}>
        {(item) => (
          <div
            key={item.day.toString()}
            onClick={() => setSelectedDay(item.day)}
            style={{ padding: "6px 0px" }}
          >
            <Flex justifyContent="space-between" flexGrow={1}>
              <View>
                {formatDateHumanReadable(item.day)}{" "}
                {isToday(item.day) ? "(Today)" : ""}
              </View>{" "}
              <Calories>{item.calories}</Calories>
            </Flex>
          </div>
        )}
      </List>
      <Flex direction="column">
        <Text>
          Weekly average:{" "}
          {Number.isFinite(average) ? `${average} kcal` : "no data"}
        </Text>

        <Text>Weight: {weight === null ? "not logged" : `${weight} kg`}</Text>

        <DialogTrigger type="tray">
          <ActionButton>Log weight</ActionButton>
          {(close) => (
            <Dialog>
              <Heading>Log weight</Heading>
              <Divider />
              <Content>
                <Form
                  onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const weight = event.currentTarget.weight.value;
                    logWeight(weight);
                    close();
                  }}
                >
                  <TextField
                    inputMode="decimal"
                    name="weight"
                    label="Weight"
                    isRequired
                    defaultValue={weight === null ? "" : String(weight)}
                  />
                  <Button variant="cta" type="submit">
                    Log
                  </Button>
                </Form>
              </Content>
            </Dialog>
          )}
        </DialogTrigger>
      </Flex>
    </div>
  );
}

export default function Weeks() {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const today = startOfToday();
  const ref = useRef<HTMLDivElement>(null);
  const rect = useRect(ref);

  return (
    <div style={{ height: "100%" }} ref={ref}>
      {selectedDay ? (
        <>
          <Button variant="cta" onPress={() => setSelectedDay(null)}>
            Go back
          </Button>
          <Day date={selectedDay} />
        </>
      ) : (
        rect && (
          <FixedSizeList
            width={rect.width}
            height={rect.height}
            itemSize={440}
            itemCount={52}
          >
            {({ index, style }) => (
              <Week
                style={style}
                day={subWeeks(today, index)}
                setSelectedDay={setSelectedDay}
              />
            )}
          </FixedSizeList>
        )
      )}
    </div>
  );
}
