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
];

export function calculateCPM(
  numberOfCharacters: number,
  secondsTaken: number,
): number {
  const minutesTaken = secondsTaken / 60;
  const cpm = Math.round(numberOfCharacters / minutesTaken);
  if (Number.isNaN(cpm)) {
    // result chart graph needs a 0 value
    return 0;
  }
  return cpm;
}

export function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number,
): number {
  const accuracy = (1 - errorsCount / numberOfCharacters) * 100;
  if (Number.isNaN(accuracy)) {
    // result chart graph needs a 0 value
    return 0;
  }
  return accuracy;
}
