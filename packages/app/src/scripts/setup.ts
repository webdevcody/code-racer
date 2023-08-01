import { exec } from "child_process";
import { logger } from "../lib/logger";

const getVersion = (version: string) => version.slice(1);

async function setup() {
  logger.log("📂 Setting up project...");

  exec("node -v", (error, stdout) => {
    if (error) {
      logger.error("❌ Node is not installed. Please install Node.");
    } else {
      const major = getVersion(stdout).split(".")[0];

      if (Number(major) < 18) {
        logger.error("❌ Node version must be at least v18.");
      }
    }
  });

  exec("docker -v", (error, stdout) => {
    if (error) {
      logger.error("❌ Docker is not installed. Please install Docker.");
    } else {
      const major = getVersion(stdout).split(".")[0];

      if (Number(major) < 23) {
        logger.error("❌ Docker version must be at least v23.");
      }
    }
  });

  logger.log("📦 Installing dependencies...");
  exec("npm install");

  logger.success("✅ Setup complete!");
}

setup();

export { setup };
