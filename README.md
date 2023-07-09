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

### Prerequisites

You will need to [install docker](https://example.com) on your local machine.

### Installation

To get started with Code Racer locally, follow these steps

1. Clone the repo
   ```sh
    git clone https://github.com/webdevcody/code-racer.git
   ```
2. Navigate to the project directory

   ```sh
   cd code-racer
   ```

3. Install NPM packages
   ```sh
   npm install
   ```
4. Generate a version of Prisma Client that is tailored to the models.
   ```js
   npx prisma generate
   ```
5. Create .env file

6. Copy and paste variables from `.env.example` into `.env`

7. Update each variable in `.env` (optional).

8. Start a docker container for the database.
   ```sh
   docker compose up
   ```
9. Once your database is ready, push your prisma schema to the database.
   ```sh
   npx prisma db push
   ```
10. Finally start your dev server.
    ```sh
    npm run dev
    ```

Open your browser and visit http://localhost:3000 to see the application running.

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
