"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="m-2 text-center">Accuracy</CardTitle>
      </CardHeader>
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
    </Card>
  );
}

export default AccuracyChart;
