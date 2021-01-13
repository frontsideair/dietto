import React, { FormEvent, Key, useState } from "react";
import { startOfToday } from "date-fns";
import { sum, map } from "ramda";
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
} from "@adobe/react-spectrum";

import {
  findMeal,
  Log,
  Meal,
  useLimit,
  useLogs,
  useMeals,
} from "../utils/database";
import Datepicker from "../components/Datepicker";
import Chart from "../components/Chart";
import List from "../components/List";
import LogItem from "../components/LogItem";

function calculateCalories(logs: Log[], meals: Meal[]) {
  return sum(
    map((log) => findMeal(log.mealId, meals).value * log.portion, logs)
  );
}

export default function Today() {
  const [date, setDate] = useState(startOfToday());
  const [limit] = useLimit();
  const [logs, addLog, editLog, deleteLog] = useLogs(date);
  const [meals] = useMeals();
  const calories = calculateCalories(logs, meals);
  return (
    <>
      <Datepicker date={date} setDate={setDate} />
      <Chart value={calories} maxValue={limit} />
      <List items={logs}>
        {(log) => (
          <DialogTrigger type="tray" isDismissable key={log.timestamp}>
            <ActionButton isQuiet>
              <LogItem>{log}</LogItem>
            </ActionButton>
            {(close) => (
              <Dialog>
                <Heading>Edit log</Heading>
                <Divider />
                <Content>
                  <Form
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const { mealname, calories } = event.currentTarget;
                      editLog(log, mealname.value, calories.value);
                      close();
                    }}
                  >
                    <MealPicker defaultSelectedKey={log.mealId}>
                      {(meal) => <Item key={meal.id}>{meal.name}</Item>}
                    </MealPicker>
                    <TextField
                      inputMode="numeric"
                      name="portion"
                      label="Portion"
                      isRequired
                      defaultValue={String(log.portion)}
                    />
                    <Button variant="cta" type="submit">
                      Save
                    </Button>
                    <Button
                      variant="negative"
                      onPress={() => {
                        deleteLog(log);
                        close();
                      }}
                    >
                      Delete
                    </Button>
                  </Form>
                </Content>
              </Dialog>
            )}
          </DialogTrigger>
        )}
      </List>
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
                  addLog(meal.value, portion.value);
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
    </>
  );
}

function MealPicker({
  defaultSelectedKey,
  children,
}: {
  defaultSelectedKey?: Key;
  children: (meal: Meal) => any;
}) {
  const [meals] = useMeals();
  return (
    <Picker
      name="meal"
      label="Meal"
      items={meals}
      isRequired
      defaultSelectedKey={defaultSelectedKey}
    >
      {children}
    </Picker>
  );
}
