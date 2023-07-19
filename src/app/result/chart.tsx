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
import { ReplayCode } from "./replay-timestamps";

const dataKeys: ResultChartLineProps[] = [
  { dataKey: "accuracy", stroke: "#0261b9" },
  { dataKey: "cpm", stroke: "#0ee2c6" },
  { dataKey: "errorCount", stroke: "#f00d0d" },
];

interface raceTimeStampProps {
  char: string;
  accuracy: number;
  cpm: number;
  time: number;
}

interface replayTimeStampProps {
  char: string;
  textIndicatorPosition: number | number[];
  currentLineNumber: number;
  currentCharPosition: number;
  errors: number[];
  totalErrors: number;
  time: number;
}

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

function renderTooltip(
  props: TooltipProps<ValueType, NameType>,
  setActiveCharIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
) {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    setActiveCharIndex(data.time);

    return (
      <div className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <p>{data.word}</p>
        <p className="flex flex-col">
          <span>Char : {data.char}</span>
          <span>Accuracy : {Math.ceil(data.accuracy)}</span>
          <span>Cpm : {data.cpm}</span>
        </p>
      </div>
    );
  }
}

export function CurrentChart({ code }: { code?: string }) {
  const [raceTimeStamp, setRaceTimeStamp] = useState<raceTimeStampProps[]>([]);
  const [replayTimeStamp, setReplayTimeStamp] = useState<replayTimeStampProps[]>([]);
  const [activeCharIndex, setActiveCharIndex] = useState<number>();
  let removeExtras = 0;

  useEffect(() => {
    const getData = () => {
      return JSON.parse(localStorage.getItem("raceTimeStamp") || "[]");
    };

    const getReplay = () => {
      return JSON.parse(localStorage.getItem("replayTimeStamp") || "[]");
    }

    const data = getData();
    const replay = getReplay();
    setReplayTimeStamp(replay);
    return setRaceTimeStamp(data);
  }, []);

  const RenderCode = () => {
    return (
      <code className="flex-wrap text-2xl hidden sm:block whitespace-pre-wrap">
        {code &&
          code.split("").map((item, index) => {
            if (item !== " " && item !== "\n" && item !== "↵") {
              const raceChar = raceTimeStamp[index - removeExtras];
              return (
                <span
                  key={index}
                  className={`text-2xl ${
                    activeCharIndex === raceChar?.time
                      ? "bg-primary text-secondary"
                      : ""
                  }`}
                >
                  {item}
                </span>
              );
            } else {
              removeExtras++;
              return (
                <span key={index} className="text-2xl">
                  {item}
                </span>
              );
            }
          })}
      </code>
    );
  };

  return (
    <div style={{ width: "100%" }} className="mx-auto pb-3 flex flex-col">
      <ResponsiveContainer height={300}>
        <LineChart data={raceTimeStamp} margin={{ right: 25, top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="char" tick={{ fontSize: 0 }} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Line
            type="monotone"
            dataKey="accuracy"
            yAxisId="left"
            stroke="hsl(var(--warning-dark))"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="cpm"
            yAxisId="right"
            stroke="hsl(var(--warning-light))"
            activeDot={{ r: 8 }}
          />
          <Tooltip
            content={(props) => renderTooltip(props, setActiveCharIndex)}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="px-2 bg-accent text-primary">
        <RenderCode />
      </div>
      <div className="relative">
        <ReplayCode code={code} replayTimeStamp={replayTimeStamp} />
      </div>
    </div>
  );
}
