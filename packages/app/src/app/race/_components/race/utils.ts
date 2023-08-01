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
  return Math.round(numberOfCharacters / minutesTaken);
}

export function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number,
): number {
  return (1 - errorsCount / numberOfCharacters) * 100;
}
