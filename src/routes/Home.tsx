import React, { FormEvent, Key, useState } from "react";
import { startOfToday } from "date-fns";
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
  Text,
} from "@adobe/react-spectrum";

import { Meal, useLimit, useLogs, useMeals } from "../utils/database";
import Datepicker from "../components/Datepicker";
import Chart from "../components/Chart";
import List from "../components/List";

export default function Home() {
  const [date, setDate] = useState(startOfToday());
  const [limit] = useLimit();
  const [logs, addLog, editLog, deleteLog] = useLogs(date);
  return (
    <>
      <Datepicker date={date} setDate={setDate} />
      <Chart value={0} maxValue={limit} />
      <List items={logs}>
        {(log) => (
          <DialogTrigger type="tray" isDismissable key={log._id}>
            <ActionButton isQuiet>
              <Text>{log.name}</Text>
              <Text>{log.portion}</Text>
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
                      editLog(log, mealname.value, calories.value).then(close);
                    }}
                  >
                    <MealPicker defaultSelectedKey={log.name}>
                      {(meal) => <Item key={meal._id}>{meal.name}</Item>}
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
                    <Button variant="negative" onPress={() => deleteLog(log)}>
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
                  addLog(meal.value, portion.value).then(close);
                }}
              >
                <MealPicker>
                  {(meal) => <Item key={meal._id}>{meal.name}</Item>}
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
  children: (meal: PouchDB.Core.ExistingDocument<Meal>) => any;
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
