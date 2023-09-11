"use client";

import type { chartTimeStamp } from "../main-content";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

import React from "react";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { Heading } from "@/components/ui/heading";

type Props = {
  timeStamp: chartTimeStamp;
};

const ACCURACY_COLOR = "#0261b9";
const CPM_COLOR = "#0ee2c6";

const calculateAverageInChart = (
  timeStamp: chartTimeStamp,
  whatToGet: "errors" | "accuracy" | "cpm"
) => {
  let sum = 0;
  for (let idx = 0; idx < timeStamp.length; ++idx) {
    switch (whatToGet) {
      case "accuracy":
        sum += timeStamp[idx].accuracy;
        break;
      case "cpm":
        sum += timeStamp[idx].cpm;
        break;
      case "errors":
        sum += timeStamp[idx].errors;
        break;
    }
  }
  return (sum / (timeStamp.length - 1)).toFixed(2);
};

const Result: React.FC<Props> = React.memo(({ timeStamp }) => {
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

  return (
    <React.Fragment>
      <div className="flex flex-col gap-8">
        <Heading
          typeOfHeading="h2"
          size="h2"
          title="Results"
          description="Your cpm and accuracy for each code you typed over time."
        />
        <section className="flex flex-wrap gap-x-8 gap-y-4 items-center">
          <h3 className="sr-only">Result Summary</h3>
          <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
            <div>Average CPM</div>
            <div>{calculateAverageInChart(timeStamp, "cpm")}</div>
          </div>
          <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
            <div>Average Accuracy</div>
            <div>{calculateAverageInChart(timeStamp, "accuracy")}</div>
          </div>
          <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
            <div>Average Mistakes</div>
            <div>{calculateAverageInChart(timeStamp, "errors")}</div>
          </div>
          <div className="dark:border-2 shadow-lg shadow-black/20 rounded-lg p-4 flex flex-col gap-2">
            <div>Total Time Taken</div>
            <div>{timeStamp[timeStamp.length - 1].time} seconds</div>
          </div>
        </section>
      </div>
      <div className="w-full mx-auto pb-3 flex flex-col gap-6">
        <section className="w-[95%] mx-auto">
          <Heading typeOfHeading="h3" size="h3" title="Legend" />
          <div className="mt-1 flex gap-1 flex-col">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2"
                style={{ backgroundColor: ACCURACY_COLOR }}
              />
              <div>Accuracy</div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2"
                style={{ backgroundColor: CPM_COLOR }}
              />
              <div>Cpm</div>
            </div>
          </div>
        </section>
        <ResponsiveContainer height={500}>
          <LineChart data={timeStamp} margin={{ right: 25, top: 10 }}>
            <CartesianGrid strokeDasharray="2 2" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 0 }}
              label={{ value: "Time", offset: 20, dx: 10 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: "Accuracy", angle: -90, dx: -14 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Cpm", offset: 10, angle: -90, dx: 20 }}
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
              viewBox={{ width: 400, height: 300 }}
              content={(props) => (
                <RenderedTooltip
                  props={props}
                  setActiveIndex={setActiveIndex}
                />
              )}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="w-[90%] mx-auto px-2 bg-accent text-primary">
          <code className="px-2 flex-wrap text-2xl">
            <pre className="overflow-auto break-words whitespace-pre-wrap">
              <Code
                code={timeStamp[timeStamp.length - 1].word}
                char={timeStamp[timeStamp.length - 1].word.charAt(0)}
                activeIndex={activeIndex}
              />
            </pre>
          </code>
        </div>
      </div>
    </React.Fragment>
  );
});

type CodeProps = {
  code: string;
  char: string;
  activeIndex: undefined | number;
  amountInRecursion?: number;
};

const Code: React.FC<CodeProps> = ({
  code,
  activeIndex,
  char,
  amountInRecursion = 0,
}) => {
  return (
    <React.Fragment>
      <span
        className={cn("text-2xl", {
          "bg-primary text-secondary": activeIndex === amountInRecursion,
        })}
      >
        {char}
      </span>
      {amountInRecursion < code.length && (
        <Code
          code={code}
          activeIndex={activeIndex}
          char={code.charAt(amountInRecursion + 1)}
          amountInRecursion={amountInRecursion + 1}
        />
      )}
    </React.Fragment>
  );
};

type RenderedTooltipProps = {
  props: TooltipProps<ValueType, NameType>;
  setActiveIndex: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const RenderedTooltip: React.FC<RenderedTooltipProps> = React.memo(
  ({ props, setActiveIndex }) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
      const data = payload[0] && payload[0].payload;
      setActiveIndex(data.word.length - 1);

      return (
        <section className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
          <div className="flex flex-col">
            <span className={`text-[${CPM_COLOR}]`}>Cpm : {data.cpm}</span>
            <span className={`text-[${ACCURACY_COLOR}]`}>
              Accuracy: {Math.ceil(data.accuracy)}
            </span>
            <span>
              Code:
              <pre className="whitespace-pre-wrap overflow-auto break-words">
                {data.word}
              </pre>
            </span>
          </div>
        </section>
      );
    }

    return null;
  }
);

RenderedTooltip.displayName = "RenderedTooltip";
Result.displayName = "Result";
export default Result;
