"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface AccuracyChartProps {
  recentGames: any;
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ recentGames }) => {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="text-center m-2">Accuracy</CardTitle>
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
};

export default AccuracyChart;
