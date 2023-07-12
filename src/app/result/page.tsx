"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Chart from "./chart";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";

const card = [
  { title: "WPM", value: "81 %" },
  { title: "Accuracy", value: "90 %" },
  { title: "Rank", value: "20" },
  { title: "Miss", value: "21" },
  { title: "Times", value: "30s" },
];

export default function ResultsChart() {
  const router = useRouter();

  const handlerChangePage = () => {
    router.push("/race");
  };

  return (
    <div className="w-auto">
      <div className="flex flex-col justify-center gap-4 mt-5">
        <div className="flex md:flex-row flex-col md:mx-28 mx-20 gap-6">
          {card.map((c, idx) => {
            return (
              <Card className="md:w-[30%] w-[80%]" key={idx}>
                <CardHeader>
                  <CardTitle className="">{c.title}</CardTitle>
                </CardHeader>
                <CardContent>{c.value}</CardContent>
              </Card>
            );
          })}
        </div>
      </div>
      <div className="p-8 flex flex-col  rounded-xl bg-dark-lake">
        <div></div>
        <div className="flex flex-wrap justify-center gap-4">
          <Chart />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4 p-2" tabIndex={-1}>
        <Button onClick={handlerChangePage}>
          <Icons.chevronRight className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button onClick={handlerChangePage}>
          <Icons.refresh className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button>
          <Icons.picture className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <div className="text-center mt-5 text-gray-600">
        <span className="bg-[#0b1225]  m-1 p-1 rounded-md"> tab </span> +{" "}
        <span className="bg-[#0b1225] m-1 p-1 rounded-md"> enter </span> -
        restart game
      </div>
    </div>
  );
}
