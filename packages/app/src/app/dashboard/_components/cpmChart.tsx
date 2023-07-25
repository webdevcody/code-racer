"use client";

import React from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Result } from "@prisma/client";

function CpmChart({ recentGames }: { recentGames: Result[] }) {
  return (
    <div className="h-[500px]">
      <ResponsiveContainer height="100%">
        <ComposedChart
          data={recentGames}
          margin={{ right: 25, left: 25, bottom: 100 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="gameNumber" />
          <YAxis dataKey="cpm" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="cpm"
            stroke="#0da2ff"
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CpmChart;
