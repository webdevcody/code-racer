"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Result } from "@prisma/client";
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts";
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
type ObjectKey = keyof Result;

const parseDomain = (usersData: Result[], obj: ObjectKey) => [
  0,
  Math.max(
    ...usersData.map((value) =>
      obj === "cpm" ? value.cpm : Number(value.accuracy),
    ),
  ),
];

const renderTooltip = (
  props: TooltipProps<ValueType, NameType>,
  obj: ObjectKey,
) => {
  const { active, payload } = props;

  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;

    const date = new Date(data.createdAt);
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <p>{dayNames[date.getDay()]}</p>
        <p>
          <span>Cpm : </span>
          {data[obj]}
        </p>
      </div>
    );
  }
};

function BubbleChart({
  usersData,
  obj,
}: {
  usersData: Result[];
  obj: ObjectKey;
}) {
  const domain = parseDomain(usersData, obj);
  const range = [100, 500];

  // avoid null error
  if (obj === "errorCount") return <></>;

  return (
    <ResponsiveContainer width="100%" height={100}>
      <ScatterChart
        margin={{
          top: 20,
          bottom: 0,
        }}
      >
        <XAxis
          type="category"
          dataKey="createdAt"
          interval={1}
          tick={{ fontSize: 13, fill: "hsl(var(--primary))" }}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.getDate() + "/" + (date.getMonth() + 1);
          }}
        />
        <YAxis
          type="number"
          dataKey={obj}
          name={obj}
          height={60}
          width={80}
          tick={false}
          axisLine={false}
          label={{ value: obj, position: "insideRight" }}
        />
        <ZAxis type="number" dataKey={obj} domain={domain} range={range} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          wrapperStyle={{ zIndex: 100 }}
          content={(props) => renderTooltip(props, obj)}
        />
        <Scatter data={usersData}>
          {usersData.map((data, index) =>
            index < 1 ? (
              <Cell key={`cell-${index}`} fill="#A2FF86" />
            ) : data[obj] && data[obj] > usersData[index - 1][obj] ? (
              <Cell key={`cell-${index}`} fill="#A2FF86" />
            ) : (
              <Cell key={`cell-${index}`} fill="#E21818" />
            ),
          )}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default function PerformanceComparison({
  recentGames,
}: {
  recentGames: Result[];
}) {
  return (
    <Tabs defaultValue="cpm" className="w-full">
      <TabsList>
        <TabsTrigger value="cpm">Cpm</TabsTrigger>
        <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
      </TabsList>
      <TabsContent value="cpm">
        <BubbleChart obj="cpm" usersData={recentGames} />
      </TabsContent>
      <TabsContent value="accuracy">
        <BubbleChart obj="accuracy" usersData={recentGames} />
      </TabsContent>
    </Tabs>
  );
}
