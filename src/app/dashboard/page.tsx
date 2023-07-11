"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import { Icons } from "@/components/icons";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 5;

  // List of recent games.
  const recentGames = [
    {
      gameId: "cljvlqkcz000008l424hi4l4c",
      gameNumber: 1,
      date: "03/02/2023",
      accuracy: 92,
      errors: 2,
      wpm: 42,
    },
    {
      gameId: "cljvlqpag000208l47as7d9h4",
      gameNumber: 2,
      date: "06/02/2023",
      accuracy: 89,
      errors: 2,
      wpm: 65,
    },
    {
      gameId: "cljvlqsj8000408l4ahr36soj",
      gameNumber: 3,
      date: "08/02/2023",
      accuracy: 78,
      errors: 2,
      wpm: 80,
    },
    {
      gameId: "cljvlqsj8000448ewhr36s32",
      gameNumber: 4,
      date: "08/02/2023",
      accuracy: 92,
      errors: 2,
      wpm: 92,
    },
  ];

  function handleChangePage(newPage: number) {
    if (newPage <= 1) {
      newPage = 1;
    }
    if (newPage >= Math.ceil(recentGames.length / limit)) {
      newPage = Math.ceil(recentGames.length / limit);
    }
    setCurrentPage(newPage);
  }

  const maxWpm = recentGames.reduce((max, value) => {
    return (max = max > value.wpm ? max : value.wpm);
  }, 0);
  const maxAccuracy = recentGames.reduce((max, value) => {
    return (max = max > value.accuracy ? max : value.accuracy);
  }, 0);
  const wpm =
    recentGames.reduce((total, current) => total + current.wpm, 0) /
    recentGames.length;
  const accuracy =
    recentGames.reduce((total, current) => total + current.accuracy, 0) /
    recentGames.length;

  return (
    <div className="flex flex-col gap-8 container mx-auto mb-8">
      <h1 className="text-4xl m-6 font-bold text-center mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <Card className="h-[400px]">
          <CardHeader>
            <CardTitle className="text-center m-2">Words per minute</CardTitle>
          </CardHeader>
          <ResponsiveContainer height="100%">
            <ComposedChart
              data={recentGames}
              margin={{ right: 25, left: 25, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameNumber" />
              <YAxis dataKey="wpm" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#0da2ff"
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none">
          <CardHeader>
            <CardTitle className="text-center m-2">Recent Races</CardTitle>
          </CardHeader>
          <Table className="w-full max-[600px]:text-sm border-b-2">
            <TableHeader>
              <TableRow>
                <TableHead className="max-[900px]:hidden">Game ID</TableHead>
                <TableHead>Errors</TableHead>
                <TableHead>Accuracy</TableHead>
                <TableHead>Wpm</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentGames
                .slice(currentPage - 1, currentPage - 1 + limit)
                .map((game) => {
                  return (
                    <TableRow key={game.gameId}>
                      <TableCell className="max-[900px]:hidden">
                        {game.gameId}
                      </TableCell>
                      <TableCell className="text-red-600 hover:text-red-500">
                        {game.errors} Errors
                      </TableCell>
                      <TableCell>{game.accuracy}%</TableCell>
                      <TableCell>{game.wpm} Wpm</TableCell>
                      <TableCell>{game.date}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant={"outline"} onClick={() => handleChangePage(1)}>
              <Icons.chevronsLeft />
            </Button>
            <Button
              variant={"outline"}
              onClick={() => handleChangePage(currentPage - 1)}
            >
              <Icons.chevronLeft />
            </Button>
            <Input
              className="w-12 text-center"
              type="number"
              placeholder={`${currentPage}`}
            />
            <Button
              variant={"outline"}
              onClick={() => handleChangePage(currentPage + 1)}
            >
              <Icons.chevronRight />
            </Button>
            <Button
              variant={"outline"}
              onClick={() =>
                handleChangePage(Math.ceil(recentGames.length / limit))
              }
            >
              <Icons.chevronsRight />
            </Button>
          </div>
        </Card>
        <Card className="w-[42vw] max-[850px]:w-screen min-[850px]:h-[50vh] mr-4 border-none">
          <CardHeader>
            <CardTitle className="text-center m-2">Statistics</CardTitle>
          </CardHeader>
          <div className="flex flex-col justify-center gap-4 mt-4">
            <div className="flex flex-row justify-center gap-6">
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Highest Wpm</CardTitle>
                </CardHeader>
                <CardContent>{maxWpm.toFixed(2)} Wpm</CardContent>
              </Card>
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Highest accuracy</CardTitle>
                </CardHeader>
                <CardContent>{maxAccuracy.toFixed(2)}%</CardContent>
              </Card>
            </div>
            <div className="flex flex-row justify-center gap-6 max-[850px]:mb-10">
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Average Wpm</CardTitle>
                </CardHeader>
                <CardContent>{wpm.toFixed(2)} Wpm</CardContent>
              </Card>
              <Card className="w-[40%]">
                <CardHeader>
                  <CardTitle className="">Average accuracy</CardTitle>
                </CardHeader>
                <CardContent>{accuracy.toFixed(2)}%</CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
