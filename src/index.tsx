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

import Weeks from "./routes/Weeks";
import Today from "./routes/Today";
import Meals from "./routes/Meals";
import Settings from "./routes/Settings";

enableMapSet();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider theme={defaultTheme} height="100%">
      <Flex direction="column" height="100%" maxWidth="56.25vh" marginX="auto">
        <Tabs aria-label="Diet App" height="100%">
          <TabList>
            <Item key="Today">Today</Item>
            <Item key="Weeks">Weeks</Item>
            <Item key="Meals">Meals</Item>
            <Item key="Settings">Settings</Item>
          </TabList>
          <TabPanels>
            <Item key="Today">
              <Today />
            </Item>
            <Item key="Weeks">
              <Weeks />
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
