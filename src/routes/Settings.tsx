import React, { FormEvent } from "react";
import { Button, Flex, Form, TextField } from "@adobe/react-spectrum";
import { useLimit } from "../utils/database";

export default function Settings() {
  const [limit, setLimit] = useLimit();
  return (
    <>
      <Flex direction="column" flexGrow={1}>
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLimit(Number.parseInt(event.currentTarget.limit.value, 10));
          }}
        >
          <TextField
            name="limit"
            label="Targeted daily calorie intake"
            defaultValue={String(limit)}
          />
          <Button variant="cta" type="submit">
            Save
          </Button>
        </Form>
      </Flex>
    </>
  );
}
