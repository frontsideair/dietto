import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { PouchDB } from "react-pouchdb/browser";
import {
  Provider as SpectrumProvider,
  defaultTheme,
  Flex,
  Text,
} from "@adobe/react-spectrum";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import Tabs from "./components/Tabs";

import Home from "./routes/Home";
import Meals from "./routes/Meals";
import Ingredients from "./routes/Ingredients";
import Settings from "./routes/Settings";

ReactDOM.render(
  <PouchDB name="dietto">
    <Suspense fallback={<Text>Loading...</Text>}>
      <SpectrumProvider theme={defaultTheme}>
        <BrowserRouter>
          <Flex direction="column" height="100vh" width="100vw">
            <Routes>
              <Route path="/">
                <Home />
              </Route>
              <Route path="meals">
                <Meals />
              </Route>
              <Route path="ingredients">
                <Ingredients />
              </Route>
              <Route path="settings">
                <Settings />
              </Route>
            </Routes>
            <Tabs />
          </Flex>
        </BrowserRouter>
      </SpectrumProvider>
    </Suspense>
  </PouchDB>,
  document.getElementById("root")
);
