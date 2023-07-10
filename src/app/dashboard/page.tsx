"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import {
  DoubleArrowLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const limit = 5;
  // Page 1 should show item 0 - 1
  // Const begin = page - 1
  // Const end = begin + limit

  // List of recent games.
  const recentGames = [
    {
      gameId: "cljvlqkcz000008l424hi4l4c",
      date: "03/02/2023",
      accuracy: 92,
      errors: 2,
      wpm: 42,
    },
    {
      gameId: "cljvlqpag000208l47as7d9h4",
      date: "06/02/2023",
      accuracy: 89,
      errors: 2,
      wpm: 65,
    },
    {
      gameId: "cljvlqsj8000408l4ahr36soj",
      date: "08/02/2023",
      accuracy: 78,
      errors: 2,
      wpm: 80,
    },
    {
      gameId: "cljvlqsj8000448ewhr36soj",
      date: "08/02/2023",
      accuracy: 92,
      errors: 2,
      wpm: 92,
    },
  ];
  // Accuracy data of the player in the matches
  const accuracyData = [
    { gameNumber: 1, score: 95.1 },
    { gameNumber: 2, score: 89.1 },
    { gameNumber: 3, score: 95.1 },
    { gameNumber: 4, score: 91.1 },
    { gameNumber: 5, score: 99.1 },
    { gameNumber: 6, score: 95.1 },
    { gameNumber: 7, score: 93.1 },
    { gameNumber: 8, score: 95.1 },
    { gameNumber: 9, score: 95.1 },
    { gameNumber: 10, score: 95.1 },
  ];
  // Words per minute data.
  const wpmData = [
    { gameNumber: 1, wpm: 20 },
    { gameNumber: 2, wpm: 50 },
    { gameNumber: 3, wpm: 30 },
    { gameNumber: 4, wpm: 50 },
  ];
  // All achievements and the progress of finishing it. NOTE: This should be sorted on progress.
  const achievements = [
    {
      id: "cljvlqsj8000408l4ahr36soj",
      title: "First race",
      description: "Started a race",
      progress: 100,
    },
    {
      id: "cljvlqsj8000408l4ahr36sok",
      title: "Play 10 races",
      description: "Play a total of 10 races online",
      progress: 33,
    },
    {
      id: "cljvlqsj8000408l4ahr36sok",
      title: "Play 10 races",
      description: "Play a total of 10 races online",
      progress: 33,
    },
    {
      id: "cljvlqsj8000408l4ahr36sok",
      title: "Play 10 races",
      description: "Play a total of 10 races online",
      progress: 33,
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

  return (
    <>
      <h1 className="text-4xl m-6 font-bold text-center max-[600px]:mb-10">
        Dashboard
      </h1>
      <div className="flex max-[600px]:flex-col justify-center items-center w-screen h-[50vh] gap-6 m-2">
        <Card className="w-[47.5%] max-[600px]:w-[100%] max-[600px]:mr-4 h-full max-[600px]:h-[50%]">
          <CardHeader>
            <CardTitle className="text-center m-2">Accuracy</CardTitle>
          </CardHeader>
          <ResponsiveContainer height="100%">
            <LineChart
              data={accuracyData}
              margin={{ right: 25, left: 25, bottom: 100 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameNumber" />
              <YAxis dataKey="score" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#82ca9d"
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="w-[47.5%] max-[600px]:w-[100%] h-full max-[600px]:h-[50%] max-[600px]:mr-4 max-[600px]:ml-4 max-[600px]:mb-6">
          <CardHeader>
            <CardTitle className="text-center m-2">Words per minute</CardTitle>
          </CardHeader>
          <ResponsiveContainer height="100%">
            <ComposedChart
              data={wpmData}
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
      <div className="flex max-[850px]:flex-col justify-center items-center w-screen min-[850px]:h-[50vh] gap-4 m-4">
        <Card className="w-[55vw] max-[850px]:w-[100vw] min-[850px]:h-[50vh] mr-4 p-4">
          <CardHeader>
            <CardTitle className="text-center m-2">Recent Races</CardTitle>
          </CardHeader>
          <Table className="w-full max-[600px]:text-sm">
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
              {recentGames.slice(currentPage - 1, (currentPage - 1 ) + limit).map((game) => {
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
          <div className="flex justify-center gap-4">
            <Button variant={"outline"} onClick={() => handleChangePage(1)}>
              <DoubleArrowLeftIcon />
            </Button>
            <Button variant={"outline"} onClick={() => handleChangePage(currentPage - 1)}>
              <ArrowLeftIcon />
            </Button>
            <Input className="w-12 text-center" type="number" placeholder={`${currentPage}`} />
            <Button variant={"outline"} onClick={() => handleChangePage(currentPage + 1)}>
              <ArrowRightIcon />
            </Button>
            <Button variant={"outline"} onClick={() => handleChangePage(Math.ceil(recentGames.length / limit))}>
              <DoubleArrowRightIcon />
            </Button>
          </div>
        </Card>
        <Card className="w-[40vw] max-[850px]:w-screen min-[850px]:h-[50vh] mr-4 overflow-y-scroll">
          <CardHeader>
            <CardTitle className="text-center m-2">Achievements</CardTitle>
          </CardHeader>
          {achievements.map((achievement) => {
            return (
              <Card
                className="m-4 p-2 flex justify-between"
                key={achievement.id}
              >
                <CardHeader>
                  <CardTitle>{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                {achievement.progress > 50 ? (
                  <p className="font-normal text-green-500 mt-auto mb-auto mr-2">
                    {achievement.progress}%
                  </p>
                ) : (
                  <p className="font-normal text-yellow-400 mt-auto mb-auto mr-2">
                    {achievement.progress}%
                  </p>
                )}
              </Card>
            );
          })}
        </Card>
      </div>
    </>
  );
}
