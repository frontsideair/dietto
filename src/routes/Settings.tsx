import React, { FormEvent } from "react";
import {
  Button,
  Content,
  Divider,
  Flex,
  Form,
  Header,
  TextField,
} from "@adobe/react-spectrum";
import { useLimit } from "../utils/database";
import { downloadJSON } from "../utils/utils";

export default function Settings() {
  const [limit, setLimit] = useLimit();
  return (
    <Flex direction="column" flexGrow={1}>
      <Content>
        <Header>Limit</Header>
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setLimit(Number.parseInt(event.currentTarget.limit.value, 10));
          }}
        >
          <TextField
            name="limit"
            inputMode="numeric"
            label="Targeted daily calorie intake"
            defaultValue={String(limit)}
          />
          <Button variant="cta" type="submit">
            Save
          </Button>
        </Form>
      </Content>
      <Divider marginY="size-100" />
      <Content>
        <Header>Export</Header>
        <Button
          variant="cta"
          onPress={() =>
            downloadJSON(JSON.stringify(localStorage), "localStorage.json")
          }
        >
          Export data
        </Button>
      </Content>
      <Divider marginY="size-100" />
      <Content>
        <Header>Import</Header>
        <Form
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const file = event.currentTarget.data.files[0];
            file.text().then((jsonString: string) => {
              const json: Record<string, string> = JSON.parse(jsonString);
              for (const [key, value] of Object.entries(json)) {
                localStorage.setItem(key, value);
              }
            });
          }}
        >
          <TextField type="file" name="data" label="Paste export data here" />
          <Button variant="cta" type="submit">
            Import data
          </Button>
        </Form>
      </Content>
    </Flex>
  );
}
