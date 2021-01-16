import React, { FormEvent } from "react";
import {
  ActionButton,
  Content,
  Dialog,
  DialogTrigger,
  Divider,
  Form,
  Heading,
  TextField,
  Button,
  Flex,
} from "@adobe/react-spectrum";
import { useMeals } from "../utils/database";
import List from "../components/List";
import MealItem from "../components/MealItem";

export default function Meals() {
  const [meals, addMeal, editMeal, deleteMeal] = useMeals();

  return (
    <Flex direction="column" flexGrow={1}>
      <DialogTrigger type="tray">
        <ActionButton>Add</ActionButton>
        {(close) => (
          <Dialog>
            <Heading>Add new meal</Heading>
            <Divider />
            <Content>
              <Form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const { mealname, calories } = event.currentTarget;
                  addMeal(mealname.value, calories.value);
                  close();
                }}
              >
                <TextField name="mealname" label="Meal" isRequired autoFocus />
                <TextField
                  inputMode="numeric"
                  name="calories"
                  label="Calories"
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
      <List items={[...meals.values()]}>
        {(meal) => (
          <DialogTrigger type="tray" key={meal.id}>
            <ActionButton isQuiet>
              <MealItem>{meal}</MealItem>
            </ActionButton>
            {(close) => (
              <Dialog>
                <Heading>Edit meal</Heading>
                <Divider />
                <Content>
                  <Form
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const { mealname, calories } = event.currentTarget;
                      editMeal(meal.id, mealname.value, calories.value);
                      close();
                    }}
                  >
                    <TextField
                      name="mealname"
                      label="Meal"
                      defaultValue={meal.name}
                      isRequired
                      autoFocus
                    />
                    <TextField
                      inputMode="numeric"
                      name="calories"
                      label="Calories"
                      defaultValue={String(meal.calories)}
                      isRequired
                    />
                    <Button variant="cta" type="submit">
                      Save
                    </Button>
                    <Button
                      variant="negative"
                      onPress={() => {
                        deleteMeal(meal.id);
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
    </Flex>
  );
}
