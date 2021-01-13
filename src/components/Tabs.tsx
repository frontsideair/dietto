import React from "react";
import { Flex } from "@adobe/react-spectrum";
import Link from "./Link";
import Home from "@spectrum-icons/workflow/Home";
import Calendar from "@spectrum-icons/workflow/Calendar";
import Star from "@spectrum-icons/workflow/Star";
import Settings from "@spectrum-icons/workflow/Settings";

export default function Tabs() {
  return (
    <Flex justifyContent="space-around">
      <Link to="/">
        <Home aria-label="home" />
      </Link>
      <Link to="/today">
        <Calendar aria-label="today" />
      </Link>
      <Link to="meals">
        <Star aria-label="meals" />
      </Link>
      <Link to="settings">
        <Settings aria-label="settings" />
      </Link>
    </Flex>
  );
}
