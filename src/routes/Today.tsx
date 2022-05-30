import { Flex } from "@adobe/react-spectrum";

import { startOfToday } from "date-fns";
import Day from "../components/Day";

export default function Today() {
  const date = startOfToday();

  return (
    <Flex direction="column" flexGrow={1}>
      <Day date={date} />
    </Flex>
  );
}
