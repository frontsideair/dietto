import React, { FormEvent, useState } from "react";
import {
  Form,
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  TextField,
  Button,
  Flex,
  View,
} from "@adobe/react-spectrum";
import { ResponsivePie } from "@nivo/pie";

import { useDayLogs, useLimit, useMeals } from "../utils/database";
import Datepicker from "../components/Datepicker";
import List from "../components/List";
import LogItem from "../components/LogItem";
import { logsCalories, Log, Meal } from "../utils/model";
import { startOfToday } from "date-fns";
import { get } from "../utils/utils";
import FAB from "../components/FAB";
import AspectRatio from "../components/AspectRatio";

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
  const [date, setDate] = useState(startOfToday());
  const [limit] = useLimit();
  const [dayLogs, addDayLog, deleteDayLog] = useDayLogs(date);
  const calories = logsCalories([...dayLogs.values()]);
  const caloriesData = calories % limit;

  return (
    <Flex direction="column" flexGrow={1}>
      <Datepicker date={date} setDate={setDate} />
      <AspectRatio ratio={16 / 9}>
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
      </AspectRatio>
      <List items={[...dayLogs.values()]}>
        {(log: Log) => (
          <DialogTrigger type="tray" key={log.id}>
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
      <DialogTrigger type="tray">
        <FAB />
        {(close) => (
          <Dialog>
            <Heading>What did you eat?</Heading>
            <Divider />
            <Content>
              <MealForm
                onSubmit={(name, calories, portion) => {
                  addDayLog(name, calories, portion);
                  close();
                }}
              />
            </Content>
          </Dialog>
        )}
      </DialogTrigger>
    </Flex>
  );
}

type MealFormProps = {
  onSubmit: (name: string, calories: number, portion: number | null) => void;
};

function MealForm({ onSubmit }: MealFormProps) {
  const [meals] = useMeals();
  const [mealId, setMealId] = useState("");
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");
  const [portion, setPortion] = useState("1");

  const select = (
    <View elementType="label">
      <View paddingY="size-40">Meal</View>
      <select
        name="meal"
        style={{ fontSize: 16, height: 40, width: "100%" }}
        value={mealId}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          const mealId = event.currentTarget.value;
          const { name, calories } = mealId
            ? get(meals, mealId)
            : { name: "", calories: 0 };
          setMealId(mealId);
          setMealName(name);
          setMealCalories(String(calories));
          setPortion("1");
        }}
      >
        <option value="">Other</option>
        {[...meals.values()].map((meal: Meal) => (
          <option key={meal.id} value={meal.id}>
            {meal.name}
          </option>
        ))}
      </select>
    </View>
  );

  return (
    <Form
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit(
          mealName,
          Number.parseInt(mealCalories, 10),
          mealId ? Number.parseFloat(portion) : null
        );
      }}
    >
      {mealId ? (
        select
      ) : (
        <Flex>
          {select}
          <TextField
            name="mealname"
            label="Name"
            value={mealName}
            onChange={setMealName}
            marginStart="size-200"
          />
        </Flex>
      )}
      {mealId ? (
        <TextField
          inputMode="decimal"
          name="portion"
          label="Portion"
          isRequired
          value={portion}
          onChange={setPortion}
        />
      ) : (
        <TextField
          inputMode="numeric"
          name="calories"
          label="Calories"
          isRequired
          value={mealCalories}
          onChange={setMealCalories}
        />
      )}
      <Button variant="cta" type="submit">
        Add
      </Button>
    </Form>
  );
}
