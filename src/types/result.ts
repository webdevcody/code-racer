import { Result } from "@prisma/client";

export type ParsedRacesResult = Omit<Result, "accuracy" | "createdAt"> & {
    accuracy: number,
    createdAt: string
}

export type ResultChartLineProps = {
    dataKey: keyof ParsedRacesResult;
    stroke: string;
};

export interface ResultCardProps {
    title: string;
    value: string | undefined;
}

export interface ResultsChartProps {
    searchParams: { snippetId: string };
}
