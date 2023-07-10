"use client"

import React, { RefObject, useEffect, useRef } from "react";
import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

Chart.register(
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const renderChart = (
  ref: RefObject<HTMLCanvasElement>,
//   wpmChartData: number[]
) => {
  const ctx = ref.current?.getContext("2d");
  if (!ctx) return;
  const labels = [
    10, 23, 32, 44, 45, 56, 67, 90, 102, 120
  ];
  const data = [12, 34, 35, 46, 65, 78, 80];
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "WPM ",
          data,
          backgroundColor: "#20afc9",
          borderColor: "#20afc9",
          tension: 0.4,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

export default function ResultsChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const chart = renderChart(chartRef);
    return () => {
      chart?.destroy();
    };
  }, []);

  return (
    <div className="w-3/4 p-8 bg-gray-100 flex rounded-xl flex-col bg-dark-lake">
      <div className="flex flex-row">
        <h1 className="text-sm p-4 font-semibold">Words Per Minute</h1>
      </div>
      <div className="bg-dark-lake p-2 rounded-xl max-w-full h-full">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}