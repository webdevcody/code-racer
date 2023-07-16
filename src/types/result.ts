import { ParsedRacesResult } from "@/app/result/loaders";

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
