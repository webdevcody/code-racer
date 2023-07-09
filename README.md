# Code Racer

Welcome to Code Racer, a community project built with Next.js, Tailwind CSS, and TypeScript.

Code Racer is a multiplayer coding game where developers can compete against each other to solve programming challenges in real-time. Sharpen your coding skills, challenge your peers, and have fun while racing against the clock!

## Features

- Code snippet games

## Technologies Used

- Next.js: A React framework for building server-side rendered and statically generated applications.
- NextAuth: For user authentication.
- Prisma:
- Tailwind CSS: A utility-first CSS framework for rapid UI development.
- TypeScript: A typed superset of JavaScript that provides enhanced tooling and developer productivity.

## Getting Started

To get started with Code Racer locally, follow these steps:

    Clone the repository:

```bash
git clone https://github.com/webdevcody/code-racer.git
```

Navigate to the project directory:

```bash
cd code-racer
```

Install dependencies:

```bash
npm install
```
Created a .env file inside the project's root directory.

Copy and paste the content of .env.example into your .env file

Update DATABASE_URL inside your .env from "postgresql://USERNAME:PASSWORD@HOST:PORT/NAME?schema=public" to "postgresql://myuser:mypassword@localhost:5432/mydatabase?schema=public" for example or with whichever username, password, host, port, and name you chose.

If you do not have docker, go here to download and install: https://www.docker.com/get-started/

If you are getting WSL error when you launch your desktop docker application, go here and follow these steps: https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package.

Open Docker Desktop Application and go back to your VSCode terminal and run this command:

```bash
docker compose up -d
```

Generate prisma DB:

```bash
npx prisma generate
```

Updates schema to database
```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

Open your browser and visit http://localhost:3000 to see the application running.

## Configuration

Code Racer requires some configuration variables to run properly. Create a .env.local file in the root directory of the project and add the following variables:

## Contribution

We welcome contributions from the community! If you'd like to contribute to Code Racer, please follow refer to [CONTRIBUTION.md](CONTRIBUTION.md), but we have these base guidelines:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Make your changes and test thoroughly.
- Commit your changes with clear commit messages.
- Push your branch to your forked repository.
  Submit a pull request detailing your changes.

Please ensure that your code adheres to the project's coding standards and conventions.

## License

The Code Racer project is licensed under the MIT License. Feel free to use, modify, and distribute the code as per the terms of the license.
Acknowledgements

Code Racer wouldn't be possible without the valuable contributions and support from the open-source community. We would like to express our gratitude to all the contributors and acknowledge the following libraries and resources used in this project.

A big thank you to all the developers who have helped shape Code Racer into what it is today!

## Contact

If you have any questions, suggestions, or feedback regarding Code Racer, please feel free to reach out to us at in the WebDevCody discord server

Happy coding and enjoy the race!
