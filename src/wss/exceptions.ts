export class RaceFullException extends Error {
  constructor() {
    super("This room is full. Cannot add more players.");
    this.name = "RaceFullException";
  }
}
