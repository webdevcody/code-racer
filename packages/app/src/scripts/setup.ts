import { exec } from "child_process";

const getVersion = (version: string) => version.slice(1);

async function setup() {
  console.log("📂 Setting up project...");

  console.log("✅ Installing dependencies...");

  exec("node -v", (error, stdout) => {
    if (error) {
      console.log(
        "❌ Node is not installed. Please install Node version 18 or greater and try again.",
      );
      return;
    } else {
      const major = getVersion(stdout).split(".")[0];

      if (Number(major) < 18) {
        console.error(
          `❌ Node version must be at least v18. You are using v${major}.`,
        );
      }
    }
  });

  exec("docker -v", (error, stdout) => {
    if (error) {
      console.log(
        "❌ Docker is not installed. Please install Docker version 23 or greater and try again.",
      );
      return;
    } else {
      const major = getVersion(stdout).split(".")[0];

      if (Number(major) < 23) {
        console.log(
          `❌ Docker version must be at least v23. You are using v${major}.`,
        );
      }
    }
  });
}

setup();

export { setup };
