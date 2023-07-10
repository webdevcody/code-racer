"use client"

import {
  Chart,
  LineController,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";

import React, { RefObject, useEffect, useRef } from "react";

import { Button } from "../ui/button";

import CardResult from "./card";

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
  const data = [12, 34, 35, 46, 65, 78, 80, 45, 90, 120];
  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "WPM ",
          data,
          backgroundColor: "#0da3df",
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

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
]

export default function ResultsChart() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const chart = renderChart(chartRef);
    return () => {
      chart?.destroy();
    };
  }, []);

  return (
    <div className="w-3/4">
      <div className="flex gap-5 h-32 text-center my-3" >
        {card.map((item, idx) => {
          return (
            <CardResult item={item} key={idx} />
          )
        })}
      </div>
      <div className=" p-8 flex bg-[#1E1E1E] rounded-xl  flex-col bg-dark-lake">
        <div className="flex flex-row">
          <h1 className="text-sm p-4 font-semibold text-white">Words Per Minute</h1>
        </div>
        <div>
        </div>
        <div className="bg-dark-lake rounded-xl max-w-full h-full">
          <canvas ref={chartRef} />
        </div>
      </div>
      <div className="flex justify-center gap-4 p-2" >
        <Button>
          Next
        </Button>
        <Button>
          Repeat
        </Button>
        <Button>
          Screenshoot
        </Button>
      </div>
    </div>

  );
}