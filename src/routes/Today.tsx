import React, { FormEvent, useState } from "react";
import {
  Item,
  Form,
  Picker,
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  TextField,
  Button,
  Flex,
} from "@adobe/react-spectrum";
import { ResponsivePie } from "@nivo/pie";

import { useDayLogs, useLimit, useMeals } from "../utils/database";
import Datepicker from "../components/Datepicker";
import List from "../components/List";
import LogItem from "../components/LogItem";
import { calculateCalories, Meal } from "../utils/model";
import { formatDateTime } from "../utils/utils";

const YELLOW = "rgba(255, 255, 0, 100%)";
const RED = "rgba(255, 0, 0, 100%)";
const YELLOWISH = "rgba(255, 255, 0, 10%)";
const GRAY = "rgba(0, 0, 0, 50%)";

function CenteredMetric({ dataWithArc, centerX, centerY }: any) {
  const { calories, limit } = dataWithArc[0].data;
  return (
    <text
      x={centerX}
      y={centerY}
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: "24px" }}
    >
      {calories} / {limit}
    </text>
  );
}

export default function Today() {
  const [date, setDate] = useState(new Date());
  const [limit] = useLimit();
  const [dayLogs, addDayLog, deleteDayLog] = useDayLogs(date);
  const calories = calculateCalories([...dayLogs.values()]);
  const caloriesData = calories % limit;

  return (
    <Flex direction="column" flexGrow={1}>
      <Datepicker date={date} setDate={setDate} />
      <Flex height="56.25vw">
        <ResponsivePie
          margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
          data={[
            {
              id: "eaten",
              calories,
              limit,
              value: caloriesData,
              color: calories > limit ? RED : YELLOW,
            },
            {
              id: "remaining",
              value: limit - caloriesData,
              color: calories > limit ? YELLOWISH : GRAY,
            },
          ]}
          colors={{ datum: "data.color" }}
          innerRadius={0.9}
          enableSliceLabels={false}
          enableRadialLabels={false}
          isInteractive={false}
          layers={["slices", CenteredMetric]}
        />
      </Flex>
      <DialogTrigger type="tray" isDismissable>
        <ActionButton>Add</ActionButton>
        {(close) => (
          <Dialog>
            <Heading>What did you eat?</Heading>
            <Divider />
            <Content>
              <Form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const { meal, portion } = event.currentTarget;
                  addDayLog(meal.value, portion.value, formatDateTime(date));
                  close();
                }}
              >
                <MealPicker>
                  {(meal) => <Item key={meal.id}>{meal.name}</Item>}
                </MealPicker>
                <TextField
                  inputMode="numeric"
                  name="portion"
                  label="Portion"
                  isRequired
                />
                <Button variant="cta" type="submit">
                  Add
                </Button>
              </Form>
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
      <List items={[...dayLogs.values()]}>
        {(log) => (
          <DialogTrigger type="tray" isDismissable key={log.timestamp}>
            <ActionButton isQuiet>
              <LogItem>{log}</LogItem>
            </ActionButton>
            {(close) => (
              <Dialog>
                <Heading>Delete log</Heading>
                <Divider />
                <Content>
                  <Button
                    variant="negative"
                    onPress={() => {
                      deleteDayLog(log);
                      close();
                    }}
                  >
                    Delete
                  </Button>
                </Content>
              </Dialog>
            )}
          </DialogTrigger>
        )}
      </List>
    </Flex>
  );
}

function MealPicker({ children }: { children: (meal: Meal) => any }) {
  const [meals] = useMeals();
  return (
    <Picker name="meal" label="Meal" items={[...meals.values()]} isRequired>
      {children}
    </Picker>
  );
}
