"use client";

import React from "react";
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

export default function DashboardPage() {
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
      gameId: "cljvlqsj8000408l4ahr36soj",
      date: "08/02/2023",
      accuracy: 78,
      errors: 2,
      wpm: 80,
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
      title: "First race",
      description: "Started a race",
      progress: 100,
    },
    {
      title: "Play 10 races",
      description: "Play a total of 10 races online",
      progress: 33,
    },
  ];

  return (
    <>
      <h1 className="text-4xl m-6 font-bold text-center max-[600px]:mb-10">Dashboard</h1>
      <div className="flex max-[600px]:flex-col justify-center items-center w-screen h-[50vh] gap-6 m-2">
        <div className="w-[47.5%] max-[600px]:w-[100%]  max-[600px]:mr-4 h-full max-[600px]:h-[50%] rounded-lg border-gray-400 border-2 border-opacity-50 max-[600px]:ml-4">
          <h2 className="text-2xl font-bold text-center m-2">Accuracy</h2>
          <ResponsiveContainer height="100%">
            <LineChart
              data={accuracyData}
              margin={{ right: 25, left: 25, bottom: 50 }}
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
        </div>
        <div className="w-[47.5%] max-[600px]:w-[100%] h-full max-[600px]:h-[50%] rounded-lg border-gray-400 border-2 border-opacity-50 max-[600px]:mr-4 max-[600px]:ml-4 max-[600px]:mb-6">
          <h2 className="text-2xl font-bold text-center m-2">
            Words per minute
          </h2>
          <ResponsiveContainer height="100%">
            <ComposedChart
              data={wpmData}
              margin={{ right: 25, left: 25, bottom: 50 }}
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
        </div>
      </div>
      <div className="flex max-[850px]:flex-col justify-center items-center w-screen min-[850px]:h-[50vh] gap-4 m-4">
        <div className="w-[55vw] max-[850px]:w-[100vw] min-[850px]:h-[50vh] rounded-lg border-gray-400 border-2 border-opacity-50 mr-4 p-4">
          <h2 className="text-2xl font-bold text-center m-2">Recent Races</h2>
          <table className="w-full text-center max-[600px]:text-sm">
            <tr>
              <th className="max-[900px]:hidden">Game ID</th>
              <th>Errors</th>
              <th>Accuracy</th>
              <th>Wpm</th>
              <th>Date</th>
            </tr>
            {recentGames.map((game) => {
              return (
                <tr className="m-10">
                  <td className="max-[900px]:hidden">{game.gameId}</td>
                  <td className="text-red-600 hover:text-red-500">
                    {game.wpm} Errors
                  </td>
                  <td>{game.accuracy}%</td>
                  <td>{game.wpm} Wpm</td>
                  <td>{game.date}</td>
                </tr>
              );
            })}
          </table>
        </div>
        <div className="w-[40vw] max-[850px]:w-screen min-[850px]:h-[50vh] rounded-lg border-gray-400 border-2 border-opacity-50 mr-4">
          <h2 className="text-2xl font-bold text-center m-2">Achievements</h2>
          {achievements.map((achievement) => {
            return (
              <div className="border-gray-500 border-2 border-opacity-50 rounded-lg m-4 p-4 flex justify-between">
                <div>
                <p className="font-bold min-[850px]:text-xl text-md">{achievement.title}</p>
                <p className="font-normal min-[850px]:text-xs text-sm">{achievement.description}</p>
                </div>
                {achievement.progress > 50 ? (
                  <p className="font-normal text-green-500 mt-auto mb-auto">
                    {achievement.progress}%
                  </p>
                ) : (
                  <p className="font-normal text-yellow-400 mt-auto mb-auto">
                    {achievement.progress}%
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
