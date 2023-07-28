export interface RaceTimeStampProps {
  char: string;
  accuracy: number;
  cpm: number;
  time: number;
}

export interface ReplayTimeStampProps {
  char: string;
  textIndicatorPosition: number | number[];
  currentLineNumber: number;
  currentCharPosition: number;
  errors: number[];
  totalErrors: number;
  time: number;
}
