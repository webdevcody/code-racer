import { TimeStampType } from "@code-racer/wss/src/store/types";

export const noopKeys = [
  "Alt",
  "ArrowUp",
  "ArrowDown",
  "Control",
  "Meta",
  "CapsLock",
  "Shift",
  "altGraphKey", // - Please confirm I am unable to test this
  "AltGraph", // - Please confirm I am unable to test this
  "ContextMenu",
  "Insert",
  "Delete",
  "PageUp",
  "PageDown",
  "Home",
  "OS",
  "NumLock",
  "Tab",
  "ArrowRight",
  "ArrowLeft",
  "Dead",
];

export function calculateCPM(
  numberOfCharacters: number,
  secondsTaken: number
): number {
  if (numberOfCharacters === 0 || secondsTaken === 0) {
    return 0;
  } else {
    const minutesTaken = secondsTaken / 60;
    const cpm = Math.round(numberOfCharacters / minutesTaken);
    if (Number.isNaN(cpm)) {
      return 0;
    }
    return cpm;
  }
}

export function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number
): number {
  /** since 0 / num === cannot be divided, accuracy would be null */
  if (numberOfCharacters === 0 || errorsCount === 0) {
    return 100;
  } else {
    const accuracy = (1 - errorsCount / numberOfCharacters) * 100;
    if (Number.isNaN(accuracy)) {
      // result chart graph needs a 0 value
      return 0;
    }
    return accuracy;
  }
}

export function calculateAvgInTimeStamp(
  timeStamp: TimeStampType[]
): TimeStampType {
  let avgAccuracy = 0;
  let avgCpm = 0;
  let averageErrors = 0;
  let accuracySum = 0;
  let cpmSum = 0;
  let errorSum = 0;

  for (let idx = 0; idx < timeStamp.length; ++idx) {
    accuracySum += timeStamp[idx].accuracy;
    cpmSum += timeStamp[idx].cpm;
    errorSum += timeStamp[idx].errors;
  }

  avgAccuracy = +(accuracySum / timeStamp.length).toFixed(2);
  avgCpm = +(cpmSum / timeStamp.length).toFixed(2);
  averageErrors = +(errorSum / timeStamp.length).toFixed(2);

  return {
    cpm: isNaN(avgCpm) ? 0 : avgCpm,
    accuracy: isNaN(avgAccuracy) ? 0 : avgAccuracy,
    errors: isNaN(averageErrors) ? 0 : averageErrors,
  };
}
