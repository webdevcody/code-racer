#!/usr/bin/env node

const fs = require('fs');
const dotenv = require('dotenv');
const { spawn } = require("node:child_process");

// Load environment variables from .env file
const envConfig = dotenv.parse(fs.readFileSync('/app/.env'));
for (const key in envConfig) {
  process.env[key] = envConfig[key];
}

// Remove the .env file after setting the environment variables
fs.unlinkSync('/app/.env');

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
