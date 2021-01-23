import React from "react";
import ReactDOM from "react-dom";
import { Provider, defaultTheme, Flex } from "@adobe/react-spectrum";
import { Tabs, Item } from "@react-spectrum/tabs";
import { enableMapSet } from "immer";

import "./index.css";

import Week from "./routes/Week";
import Today from "./routes/Today";
import Meals from "./routes/Meals";
import Settings from "./routes/Settings";

enableMapSet();

ReactDOM.render(
  <Provider theme={defaultTheme}>
    <Flex
      direction="column"
      minHeight="100vh"
      maxWidth="56.25vh"
      marginX="auto"
    >
      <Tabs aria-label="Diet App">
        <Item title="Today" key="today">
          <Today />
        </Item>
        <Item title="Meals" key="meals">
          <Meals />
        </Item>
        <Item title="Week" key="week">
          <Week />
        </Item>
        <Item title="Settings" key="settings">
          <Settings />
        </Item>
      </Tabs>
    </Flex>
  </Provider>,
  document.getElementById("root")
);
