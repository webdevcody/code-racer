export function calculateCPM(numberOfCharacters: number, secondsTaken: number): number {
  const minutesTaken = secondsTaken / 60;
  return Math.round(numberOfCharacters / minutesTaken);
}

export function calculateAccuracy(numberOfCharacters: number, errorsCount: number): number {
  return 1 - errorsCount / numberOfCharacters;
}

export function calculateRemainder(counter: number, line: string): string {
  let s = "";
  for (let i = counter; i < line.length; i++) {
    s += " ";
  }
  return s + "\n";
}

export function createIndent(line: string): string {
  let s = "";
  if (line != undefined) {
    for (let i = 0; i <= line.length; i++) {
      if (line.charAt(i) == " ") {
        s += " ";
      } else {
        break;
      }
    }
  }
  return s;
}

export function previousLines(lines: string[], line: number): string {
  let s = "";
  for (let i = 0; i < line; i++) {
    s += lines[i] + "\n";
  }
  return s;
}
