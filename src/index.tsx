import React from "react";
import ReactDOM from "react-dom";
import {
  Provider as SpectrumProvider,
  defaultTheme,
  Flex,
} from "@adobe/react-spectrum";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import Tabs from "./components/Tabs";

import Home from "./routes/Home";
import Today from "./routes/Today";
import Meals from "./routes/Meals";
import Settings from "./routes/Settings";

ReactDOM.render(
  <SpectrumProvider theme={defaultTheme}>
    <Router>
      <Flex direction="column" height="100vh" width="100vw">
        <Routes>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/today">
            <Today />
          </Route>
          <Route path="meals">
            <Meals />
          </Route>
          <Route path="settings">
            <Settings />
          </Route>
        </Routes>
        <Tabs />
      </Flex>
    </Router>
  </SpectrumProvider>,
  document.getElementById("root")
);
