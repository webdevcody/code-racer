"use client";

import type { Result } from "@prisma/client";
import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
type ObjectKey = keyof Result;

// const usersData = [
//     {
//         "id": "clk10eoyv000u356i8nunkjv6",
//         "createdAt": "2023-07-12T16:36:10.280Z",
//         "accuracy": 61.6,
//         "cpm": 780,
//         "takenTime": "10.06",
//         "errorCount": 17,
//         "snippetId": "clk10eoyv000v356ibxyxezjd",
//         "userId": "clk10eoyv000w356irpdzubdp"
//     },
//     {
//         "id": "clk10eoyv000x356ivjs58980",
//         "createdAt": "2023-07-11T05:44:28.028Z",
//         "accuracy": 99.9,
//         "cpm": 832,
//         "takenTime": "3.73",
//         "errorCount": 5,
//         "snippetId": "clk10eoyv000y356ir3zqszno",
//         "userId": "clk10eoyv000z356ijw5nh0bh"
//     },
//     {
//         "id": "clk10eoyv0010356iuv38jkbh",
//         "createdAt": "2023-07-11T05:32:51.038Z",
//         "accuracy": 4.2,
//         "cpm": 910,
//         "takenTime": "17.43",
//         "errorCount": 94,
//         "snippetId": "clk10eoyv0011356is5k0oo3c",
//         "userId": "clk10eoyv0012356ihgukd7no"
//     },
//     {
//         "id": "clk10eoyv0013356ilc9koie7",
//         "createdAt": "2023-07-12T03:41:36.813Z",
//         "accuracy": 46.2,
//         "cpm": 622,
//         "takenTime": "29.95",
//         "errorCount": 63,
//         "snippetId": "clk10eoyv0014356i9rgyooeh",
//         "userId": "clk10eoyv0015356i4z1w71zt"
//     },
//     {
//         "id": "clk10eoyv0016356ij0uffeni",
//         "createdAt": "2023-07-09T13:30:34.499Z",
//         "accuracy": 56.3,
//         "cpm": 285,
//         "takenTime": "22.18",
//         "errorCount": 85,
//         "snippetId": "clk10eoyv0017356icvkdxc35",
//         "userId": "clk10eoyv0018356ivgyp44i3"
//     },
//     {
//         "id": "clk10eoyv0019356ijadtx92a",
//         "createdAt": "2023-07-09T13:44:24.737Z",
//         "accuracy": 53.4,
//         "cpm": 927,
//         "takenTime": "23.17",
//         "errorCount": 67,
//         "snippetId": "clk10eoyv001a356i88gmudi3",
//         "userId": "clk10eoyv001b356ihsgdq3es"
//     },
//     {
//         "id": "clk10eoyw001c356ifbltr8ml",
//         "createdAt": "2023-07-12T03:37:24.728Z",
//         "accuracy": 36.6,
//         "cpm": 488,
//         "takenTime": "35.28",
//         "errorCount": 41,
//         "snippetId": "clk10eoyw001d356i2cuy51ra",
//         "userId": "clk10eoyw001e356ijsr88smo"
//     },
//     {
//         "id": "clk10eoyw001f356il9me5ir5",
//         "createdAt": "2023-07-10T23:47:59.334Z",
//         "accuracy": 50.6,
//         "cpm": 770,
//         "takenTime": "13.41",
//         "errorCount": 22,
//         "snippetId": "clk10eoyw001g356i7ullvtsn",
//         "userId": "clk10eoyw001h356iuykp14ew"
//     },
//     {
//         "id": "clk10eoyw001i356ijvioh4a8",
//         "createdAt": "2023-07-13T02:10:47.305Z",
//         "accuracy": 46.9,
//         "cpm": 563,
//         "takenTime": "0.34",
//         "errorCount": 9,
//         "snippetId": "clk10eoyw001j356ibqflnk2q",
//         "userId": "clk10eoyw001k356ibkmtj0ty"
//     },
//     {
//         "id": "clk10eoyw001l356ipxxdqdjv",
//         "createdAt": "2023-07-10T10:54:25.093Z",
//         "accuracy": 17.7,
//         "cpm": 260,
//         "takenTime": "47.47",
//         "errorCount": 97,
//         "snippetId": "clk10eoyw001m356ipkow5iee",
//         "userId": "clk10eoyw001n356i6z26xklh"
//     }
// ]
// usersData.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

const parseDomain = (usersData: Result[], obj: ObjectKey) => [
    0,
    Math.max(
        ...usersData.map((value) => obj === "cpm" ? value.cpm : Number(value.accuracy))
    )
];

const renderTooltip = (props: TooltipProps<ValueType, NameType>, obj: ObjectKey) => {
    const { active, payload } = props;

    if (active && payload && payload.length) {
        const data = payload[0] && payload[0].payload;

        const date = new Date(data.createdAt);
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        return (
            <div
                className="border-2 bg-accent rounded-lg border-primary text-primary m-0 p-5"
            >
                <p>{dayNames[date.getDay()]}</p>
                <p>
                    <span>Cpm : </span>
                    {data[obj]}
                </p>
            </div>
        );
    }
};

export default function PerformanceComparison({ usersData, obj }: { usersData: Result[], obj: ObjectKey }) {
    const domain = parseDomain(usersData, obj);
    const range = [100, 500];

    // avoid null error
    if (obj === "errorCount") return <></>

    return (
        <ResponsiveContainer width="100%" height={100}>
            <ScatterChart
                margin={{
                    top: 20,
                    bottom: 0
                }}
            >
                <XAxis
                    type="category"
                    dataKey="createdAt"
                    interval={1}
                    tick={{ fontSize: 13, fill: "hsl(var(--primary))" }}
                    tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.getDate() + "/" + (date.getMonth() + 1);
                    }}
                />
                <YAxis
                    type="number"
                    dataKey={obj}
                    name={obj}
                    height={60}
                    width={80}
                    tick={false}
                    axisLine={false}
                    label={{ value: obj, position: "insideRight" }}
                />
                <ZAxis type="number" dataKey={obj} domain={domain} range={range} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} wrapperStyle={{ zIndex: 100 }} content={(props) => renderTooltip(props, obj)} />
                <Scatter data={usersData}>
                    {
                        usersData.map((data, index) => (
                            index < 1
                                ?
                                <Cell
                                    key={`cell-${index}`}
                                    fill="#A2FF86"
                                />
                                :
                                (data[obj] &&
                                    (data[obj] > usersData[index - 1][obj])) ?
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="#A2FF86"
                                    />
                                    :
                                    <Cell
                                        key={`cell-${index}`}
                                        fill="#E21818"
                                    />
                        ))
                    }
                </Scatter>
            </ScatterChart>
        </ResponsiveContainer>
    );
}
