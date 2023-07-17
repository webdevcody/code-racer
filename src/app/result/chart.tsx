"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ResultChartLineProps } from "@/types/result";
import { ParsedRacesResult } from "./loaders";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

const dataKeys: ResultChartLineProps[] = [
  { dataKey: "accuracy", stroke: "#0261b9" },
  { dataKey: "cpm", stroke: "#0ee2c6" },
  { dataKey: "errorCount", stroke: "#f00d0d" },
];

export default function Chart({
  raceResult,
}: {
  raceResult: ParsedRacesResult[];
}) {
  const [opacity, setOpacity] = useState<
    Partial<Record<keyof ParsedRacesResult, number>>
  >({
    cpm: 1,
    accuracy: 1,
    errorCount: 1,
  });

  const handleMouseEnter = useCallback(
    (o: any) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0.5 });
    },
    [opacity],
  );

  const handleMouseLeave = useCallback(
    (o: any) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity],
  );

  return (
    <div style={{ width: "100%", height: 300 }} className="mx-auto ">
      <ResponsiveContainer>
        <LineChart
          data={raceResult}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="createdAt" />
          <YAxis />
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          {dataKeys.map(({ dataKey, stroke }) => (
            <Line
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
              strokeOpacity={opacity[dataKey]}
              stroke={stroke}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function renderTooltip(props: TooltipProps<ValueType, NameType>) {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;

    return (
      <div className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <p>{data.word}</p>
        <p>
          <span>Time : </span>
          {data.time}
        </p>
      </div>
    );
  }
}

export function CurrentChart() {
  const [raceTimeStamp, setRaceTimeStamp] = useState<any[]>([]);

  useEffect(() => {
    const getData = () => {
      return JSON.parse(localStorage.getItem("raceTimeStamp") || "[]");
    }

    const data = getData();
    return setRaceTimeStamp(data)
  }, [])

  return (
    <div style={{ width: "100%", height: 300 }} className="mx-auto ">
      <ResponsiveContainer>
        <LineChart data={raceTimeStamp} margin={{ right: 25, top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="word" />
          <YAxis />
          <Line
            type="monotone"
            dataKey="time"
            stroke="hsl(var(--primary))"
            activeDot={{ r: 8 }}
          />
          <Tooltip content={renderTooltip} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
