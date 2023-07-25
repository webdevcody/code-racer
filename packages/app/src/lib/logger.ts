export const logger = {
  log(arg: unknown) {
    console.log(arg);
  },
  warn(arg: unknown[]) {
    console.log("\x1b[33m" + arg + "\x1b[0m");
  },
  error(arg: unknown) {
    console.error("\x1b[31m" + arg + "\x1b[0m");
    process.exit(1);
  },
  success(arg: unknown) {
    console.log("\x1b[32m" + arg + "\x1b[0m");
  },
};
