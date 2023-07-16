"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

interface CpmChartProps {
  recentGames: Result[];
}

const CpmChart: React.FC<CpmChartProps> = ({ recentGames }) => {
  return (
    <Card className="h-[400px]">
      <CardHeader>
        <CardTitle className="m-2 text-center">Characters per minute</CardTitle>
      </CardHeader>
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
    </Card>
  );
};

export default CpmChart;
