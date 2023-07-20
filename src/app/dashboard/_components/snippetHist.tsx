"use client";

import React from "react";
import type { Snippet } from "@prisma/client";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  ZAxis,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

type languageCountProps = {
  [key: string]: number;
};

type customiseDataProps = {
  language: string;
  count: number;
};

function getCustomisedData(data: Snippet[]) {
  const languageCounts: languageCountProps = {};

  // Count the occurrences of each language
  data.forEach((snippet) => {
    const language = snippet.language;
    if (languageCounts[language]) {
      languageCounts[language]++;
    } else {
      languageCounts[language] = 1;
    }
  });

  // Convert the language counts into the desired format
  const dataCustomised = Object.entries(languageCounts).map(
    ([language, count]) => {
      return {
        language,
        count,
      };
    },
  );

  return dataCustomised;
}

const renderToolTip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;

    return (
      <div className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <p>{data.language}</p>
        <p>
          <span>Count : </span>
          {data.count}
        </p>
      </div>
    );
  }
};

export function SnippetsHist({ data }: { data: Snippet[] }) {
  const customisedData: customiseDataProps[] = getCustomisedData(data);
  const domain = [0, 10];
  const range = [200, 425];

  return (
    <ResponsiveContainer width="100%" height={120}>
      <ScatterChart
        margin={{
          top: 25,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        <XAxis
          type="category"
          dataKey="language"
          interval={0}
          tick={{ fontSize: 18 }}
        />
        <YAxis
          type="number"
          dataKey="count"
          name="Count"
          tick={false}
          tickLine={false}
          axisLine={false}
          label={{ value: "Count", position: "insideRight" }}
        />
        <ZAxis type="number" dataKey="count" domain={domain} range={range} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          wrapperStyle={{ zIndex: 100 }}
          content={renderToolTip}
        />
        <Scatter data={customisedData} fill="hsl(var(--warning-dark))" />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
