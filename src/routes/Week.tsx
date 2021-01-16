import React, { useState } from "react";
import { Flex } from "@adobe/react-spectrum";
import { ResponsiveLine } from "@nivo/line";
import { addHours, startOfToday, subDays } from "date-fns";
import { useLogs, useLimit } from "../utils/database";
import { max, min, prop, range, unfold } from "ramda";
import { calculateCalories } from "../utils/model";
import { formatDate, get } from "../utils/utils";
import Datepicker from "../components/Datepicker";

function getWeek(date: Date) {
  return range(0, 7).map((diff) => subDays(date, diff));
}

export default function Week() {
  const [date, setDate] = useState(startOfToday());
  const [limit] = useLimit();
  const [logs] = useLogs();
  const week = getWeek(date);
  const data = week.map((day) => ({
    x: day,
    y: calculateCalories([...get(logs, formatDate(day), new Map()).values()]),
  }));

  const calories = data.map(prop("y"));
  const minimum = calories.reduce(min);
  const maximum = calories.reduce(max);

  return (
    <Flex height="56.25vw" direction="column">
      <Datepicker date={date} setDate={setDate} />
      <ResponsiveLine
        data={[{ id: "data", data }]}
        margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
        xScale={{
          type: "time",
          useUTC: false,
          max: addHours(startOfToday(), 23),
        }}
        yScale={{
          type: "linear",
          min: min(minimum, limit),
          max: max(maximum, limit),
        }}
        xFormat="time:%Y-%m-%d"
        axisBottom={{ format: "%b %d", tickValues: "every day" }}
        axisLeft={null}
        gridXValues={week}
        gridYValues={unfold((n) => (n >= limit ? false : [n, n + 100]), 0)}
        theme={{ grid: { line: { stroke: "#c0d7ff88" } } }}
        markers={[
          {
            axis: "y",
            value: limit,
            legend: "Limit",
            textStyle: { fontSize: 10 },
            lineStyle: { strokeDasharray: "1 2" },
          },
          {
            axis: "y",
            value: minimum,
            lineStyle: { strokeDasharray: "1 2" },
          },
          {
            axis: "y",
            value: maximum,
            lineStyle: { strokeDasharray: "1 2" },
          },
        ]}
        enablePointLabel={true}
      />
    </Flex>
  );
}
