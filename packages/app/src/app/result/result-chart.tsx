"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";

import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

interface ChartTimeStamp {
  char: string;
  accuracy: number;
  cpm: number;
  time: number;
}

type ResultChart = {
  code?: string;
};

export function ResultChart({ code }: ResultChart) {
  const data = JSON.parse(localStorage.getItem("chartTimeStamp") || "[]");
  const [chartTimeStamp, setChartTimeStamp] = useState<ChartTimeStamp[]>(data);
  const [activeCharIndex, setActiveCharIndex] = useState<number>();

  return (
    <div style={{ width: "100%" }} className="mx-auto pb-3 flex flex-col">
      <ResponsiveContainer height={300}>
        <LineChart data={chartTimeStamp} margin={{ right: 25, top: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="char" tick={{ fontSize: 0 }} label="Time" />
          <YAxis
            yAxisId="left"
            label={{ value: "Accuracy", angle: -90, dx: -14 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: "Cpm", offset: 30, angle: -90, dx: 20 }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            yAxisId="left"
            stroke="#0261b9"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="cpm"
            yAxisId="right"
            stroke="#0ee2c6"
            activeDot={{ r: 8 }}
          />
          <Tooltip
            content={(props) => RenderTooltip(props, setActiveCharIndex)}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="px-2 bg-accent text-primary">
        <RenderCode
          code={code}
          activeCharIndex={activeCharIndex}
          chartTimeStamp={chartTimeStamp}
        />
      </div>
    </div>
  );
}

type RenderCode = {
  code?: string;
  activeCharIndex?: number;
  chartTimeStamp: ChartTimeStamp[];
};

const RenderCode = ({ code, activeCharIndex, chartTimeStamp }: RenderCode) => {
  let removeExtras = 0;
  return (
    <code className="flex-wrap text-2xl hidden sm:block whitespace-pre-wrap">
      {code &&
        code.split("").map((item, index) => {
          if (item !== " " && item !== "\n") {
            const raceChar = chartTimeStamp[index - removeExtras];
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

function RenderTooltip(
  props: TooltipProps<ValueType, NameType>,
  setActiveCharIndex: React.Dispatch<React.SetStateAction<number | undefined>>,
) {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    setActiveCharIndex(data.time);

    return (
      <section className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <div className="flex flex-col">
          <span className="text-[#0ee2c6]">Cpm : {data.cpm}</span>
          <span className="text-[#0261b9]">
            Accuracy : {Math.ceil(data.accuracy)}
          </span>
          <span>Character : {data.char}</span>
        </div>
      </section>
    );
  }

  return null;
}
