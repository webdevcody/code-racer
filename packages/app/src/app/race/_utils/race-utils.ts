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
