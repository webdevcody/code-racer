"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Result } from "@prisma/client";

function AccuracyChart({ recentGames }: { recentGames: Result[] }) {
  return (
    <div className="h-[500px]">
      <ResponsiveContainer height="100%">
        <LineChart
          data={recentGames}
          margin={{ right: 25, left: 25, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gameNumber" />
          <YAxis dataKey="accuracy" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#82ca9d"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AccuracyChart;
