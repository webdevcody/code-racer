"use client"
import React from "react";

import { Button } from "../ui/button";

import CardResult from "./card";
import Chart from "./chart";

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
]

export default function ResultsChart() {
  return (
    <div className="w-auto mx-auto">
      <div className="flex gap-5 h-32 text-center my-3">
        {card.map((item, idx) => {
          return <CardResult item={item} key={idx} />;
        })}
      </div>
      <div className="p-8 flex flex-col bg-[#1E1E1E] rounded-xl bg-dark-lake">
        <div className="flex flex-row">
          <h1 className="text-sm p-4 font-semibold text-white">Words Per Minute</h1>
        </div>
        <div>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Chart />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-2">
        <Button>Next</Button>
        <Button>Repeat</Button>
        <Button>Screenshot</Button>
      </div>
    </div>

  );
}