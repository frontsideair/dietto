import React from "react";
import ReactDOM from "react-dom/client";
import {
  Provider,
  defaultTheme,
  Flex,
  Tabs,
  Item,
  TabList,
  TabPanels,
} from "@adobe/react-spectrum";
import { enableMapSet } from "immer";

import "./index.css";

import Week from "./routes/Week";
import Today from "./routes/Today";
import Meals from "./routes/Meals";
import Settings from "./routes/Settings";

enableMapSet();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider theme={defaultTheme}>
      <Flex
        direction="column"
        minHeight="100vh"
        maxWidth="56.25vh"
        marginX="auto"
      >
        <Tabs aria-label="Diet App">
          <TabList>
            <Item key="Today">Today</Item>
            <Item key="Week">Week</Item>
            <Item key="Meals">Meals</Item>
            <Item key="Settings">Settings</Item>
          </TabList>
          <TabPanels>
            <Item key="Today">
              <Today />
            </Item>
            <Item key="Week">
              <Week />
            </Item>
            <Item key="Meals">
              <Meals />
            </Item>
            <Item key="Settings">
              <Settings />
            </Item>
          </TabPanels>
        </Tabs>
      </Flex>
    </Provider>
  </React.StrictMode>
);
