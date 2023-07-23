
function calculateCPM(
  numberOfCharacters: number,
  secondsTaken: number,
): number {
  const minutesTaken = secondsTaken / 60;
  return Math.round(numberOfCharacters / minutesTaken);
}

function calculateAccuracy(
  numberOfCharacters: number,
  errorsCount: number,
): number {
  return (1 - errorsCount / numberOfCharacters) * 100;
}

export { calculateCPM, calculateAccuracy };
