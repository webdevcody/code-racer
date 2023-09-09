"use client";

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
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ParsedRacesResult } from "@/app/result/loaders";

export type ChartLine = {
  dataKey: keyof ParsedRacesResult;
  stroke: string;
};

const dataKeys: ChartLine[] = [
  { dataKey: "accuracy", stroke: "#0261b9" },
  { dataKey: "cpm", stroke: "#0ee2c6" },
  { dataKey: "errorCount", stroke: "#f00d0d" },
];

type HistoryChartProps = {
  raceResult: ParsedRacesResult[];
};

export default function HistoryChart({ raceResult }: HistoryChartProps) {
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
          <Tooltip content={(props) => RenderTooltip(props)} />
          <Legend />
          {dataKeys.map(({ dataKey, stroke }) => (
            <Line
              key={dataKey}
              type="monotone"
              dataKey={dataKey}
              stroke={stroke}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function RenderTooltip(props: TooltipProps<ValueType, NameType>) {
  const { active, payload } = props;
  if (active && payload && payload.length) {
    const data = payload[0] && payload[0].payload;
    return (
      <section className="p-5 m-0 border-2 rounded-lg bg-accent border-primary text-primary">
        <div className="flex flex-col">
          <span className="text-[#0ee2c6]">Cpm : {data.cpm}</span>

          <span className="text-[#0261b9]">
            Accuracy : {Math.ceil(data.accuracy)}
          </span>

          <span className="text-[#f00d0d]">Errors : {data.errorCount}</span>
        </div>
      </section>
    );
  }
}
