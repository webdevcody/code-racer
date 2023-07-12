// import "./styles.css";
import React, { useState, useCallback } from "react";
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

const data = [
  {
    name: "Page A",
    wpm: 4000,
    accuracy: 2400,
    error: 2400,
  },
  {
    name: "Page B",
    wpm: 3000,
    accuracy: 1398,
    error: 2210,
  },
  {
    name: "Page C",
    wpm: 2000,
    accuracy: 9800,
    error: 2290,
  },
  {
    name: "Page D",
    wpm: 2780,
    accuracy: 3908,
    error: 2000,
  },
  {
    name: "Page E",
    wpm: 1890,
    accuracy: 4800,
    error: 2181,
  },
  {
    name: "Page F",
    wpm: 2390,
    accuracy: 3800,
    error: 2500,
  },
  {
    name: "Page G",
    wpm: 3490,
    accuracy: 4300,
    error: 2100,
  },
];

export default function Chart() {
  const [opacity, setOpacity] = useState({
    wpm: 1,
    accuracy: 1,
    error: 1,
  });

  const handleMouseEnter = useCallback(
    (o: any) => {
      const { dataKey } = o;

      setOpacity({ ...opacity, [dataKey]: 0.5 });
    },
    [opacity, setOpacity],
  );

  const handleMouseLeave = useCallback(
    (o: any) => {
      const { dataKey } = o;
      setOpacity({ ...opacity, [dataKey]: 1 });
    },
    [opacity, setOpacity],
  );

  return (
    <div style={{ width: "100%", height: 300 }} className="mx-auto ">
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            strokeOpacity={opacity.accuracy}
            stroke="#0261b9"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="wpm"
            strokeOpacity={opacity.wpm}
            stroke="#0ee2c6"
          />
          <Line
            type="monotone"
            dataKey="error"
            strokeOpacity={opacity.wpm}
            stroke="#f00d0d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
