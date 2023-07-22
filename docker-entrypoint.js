#!/usr/bin/env node

// This is for the build to not crash, because the secrets are not set during this process for some reason
process.env.SKIP_ENV_VALIDATION = "true";
const { spawn } = require("node:child_process");

const env = { ...process.env };

(async () => {
    // If running the web server then migrate existing database
    if (process.argv.slice(2).join(" ") === "npm run start") {
        await exec("npx prisma migrate deploy");
    }

    // launch application
    await exec(process.argv.slice(2).join(" "));
})();

function exec(command) {
    const child = spawn(command, { shell: true, stdio: "inherit", env });
    return new Promise((resolve, reject) => {
        child.on("exit", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`${command} failed rc=${code}`));
            }
        });
    });
}
