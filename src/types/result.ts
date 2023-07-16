import { Result } from "@prisma/client";

export type ParsedRacesResult = Omit<Result, "createdAt"> & {
  createdAt: string;
};

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
