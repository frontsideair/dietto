import React, { FormEvent } from "react";
import {
  Form,
  TextField,
  Text,
  DialogTrigger,
  ActionButton,
  Dialog,
  Heading,
  Divider,
  Content,
  Button,
} from "@adobe/react-spectrum";
import { useIngredients } from "../utils/database";
import List from "../components/List";

export default function Ingredients() {
  const [
    ingredients,
    addIngredient,
    editIngredient,
    deleteIngredient,
  ] = useIngredients();
  return (
    <>
      <List items={ingredients}>
        {(ingredient) => (
          <DialogTrigger type="tray" isDismissable key={ingredient._id}>
            <ActionButton isQuiet>
              <Text>{ingredient.name}</Text>
              <Text>{ingredient.calories} kcal</Text>
            </ActionButton>
            {(close) => (
              <Dialog>
                <Heading>Edit ingredient</Heading>
                <Divider />
                <Content>
                  <Form
                    onSubmit={(event: FormEvent<HTMLFormElement>) => {
                      event.preventDefault();
                      const { ingredientname, calories } = event.currentTarget;
                      editIngredient(
                        ingredient,
                        ingredientname.value,
                        calories.value
                      ).then(close);
                    }}
                  >
                    <TextField
                      name="ingredientname"
                      label="Name"
                      defaultValue={ingredient.name}
                      isRequired
                    />
                    <TextField
                      inputMode="numeric"
                      name="calories"
                      label="Calories"
                      defaultValue={String(ingredient.calories)}
                      isRequired
                    />
                    <Button variant="cta" type="submit">
                      Save
                    </Button>
                    <Button
                      variant="negative"
                      onPress={() => deleteIngredient(ingredient)}
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
            <Heading>Add new ingredient</Heading>
            <Divider />
            <Content>
              <Form
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const { ingredientname, calories } = event.currentTarget;
                  addIngredient(ingredientname.value, calories.value).then(
                    close
                  );
                }}
              >
                <TextField name="ingredientname" label="Name" isRequired />
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
    </>
  );
}
