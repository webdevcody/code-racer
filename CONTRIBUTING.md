
# CONTRIBUTING

We welcome contributions to this project! To get started, please follow the instructions below.

## Discussing Changes

Before making changes, please discuss your proposed changes via [GitHub Issues](https://github.com/webdevcody/code-racer/issues) or on the [Discord server](https://discord.gg/4kGbBaa).  

If you're working on an issue, please stay active with development and keep the communication open.

## Git Commit, Branch, and PR Naming Conventions

Please follow these naming conventions when working with git for pull requests, branches, and commits:

```text
PR: [#ISSUE ID] Title of the PR
Branch: [ISSUE ID]-title-of-the-pr (shorter)
Commit: [[ISSUE ID]] [ACTION]: what was done
```

### Example:
```text
PR: #2 Add Docker container for Postgres
Branch: 2-add-container-postgres
Commit: [2] feat: add docker container for postgres
```

---

## Prerequisites

You will need to [install Docker](https://www.docker.com/get-started/) on your local machine.

### For Mac M1 Users:
If you encounter issues starting the database on a Mac M1, you may need to update your Docker configuration file at `~/.docker/config.json`. Your file should look something like this:

```json
{
  "auths": {},
  "currentContext": "desktop-linux"
}
```

### For Windows Users:
If you're encountering WSL errors when launching Docker, follow the [Windows WSL installation steps](https://learn.microsoft.com/en-us/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package).

---

## Installation Instructions

### 1. Fork the Repository

Start by forking the repository to your own GitHub account.

### 2. Clone the Repository

Clone the forked repository to your local machine:

```sh
git clone https://github.com/<YOUR_GITHUB_ACCOUNT_NAME>/code-racer.git
```

### 3. Navigate to Project Directory

```sh
cd code-racer
```

### 4. Set up Environment Variables

Create a `.env` file in the `packages/app` directory.

Then, copy the variables from `packages/app/.env.example` into the newly created `.env` file.

### 5. Install NPM Packages

```sh
npm i
```

### 6. Start the Database

If you're using Docker, start the database with the following command:

```sh
docker-compose up
```

Alternatively, you can start the database separately:

```sh
npm run dev:db
```

### 7. Start the App Development Server

Start the development server for the app:

```sh
npm run dev:app
```

### 8. Start the WebSocket Server

Start the WebSocket server:

```sh
npm run dev:wss
```

Now, open your browser and visit [http://localhost:3000](http://localhost:3000) to see the application running.

---

## Working on New Features

### Beginner Guide to Git and GitHub

If you're new to GitHub or open-source contributions, check out the following video for a beginner-friendly guide:

[How to make a pull request on an open source project](https://youtu.be/8A4TsoXJOs8)

Additionally, there's a more specific guide for contributing to this project:

[How to contribute to open-source projects](https://www.youtube.com/watch?v=dLRA1lffWBw)

### Steps to Add a New Feature:

1. **Fork** the repository.
2. **Clone** your forked repository.
3. **Checkout** a new branch for the feature you're working on.
4. **Do your work** and make changes.
5. **Commit** your changes.
6. **Push** your branch to your fork.
7. On GitHub, go to your fork and create a Pull Request (PR) from your branch to the upstream `main`.

---

## Pulling in Changes from Upstream

Before you start working on a new branch, make sure to pull in the latest changes from the main repository:

```sh
git checkout main
git pull upstream main
```

---

## Before Submitting a Pull Request

Before submitting your PR, make sure to:

1. **Check your code** with the linter and TypeScript to ensure it builds correctly:

```sh
npm run pr:precheck
```

2. **Optional:** Run End-to-End (E2E) tests to ensure the application works as expected:

```sh
npm run e2e -w @code-racer/app
```

## Windows Setup Guide

If you're working on **Windows** and need to set up the development environment, follow these steps:

1. **Install Docker Desktop**:
   - Download and install [Docker Desktop for Windows](https://www.docker.com/get-started/).
   - Make sure Docker is running correctly.

2. **Install WSL (Windows Subsystem for Linux)**:
   - Follow the instructions to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) and ensure Ubuntu or any other Linux distribution is set up.

3. **Configure Docker to Use WSL**:
   - Open Docker Desktop, go to **Settings** → **Resources** → **WSL Integration**, and ensure your desired WSL distribution is selected.

4. **Install Node.js and NPM**:
   - Download and install the latest version of [Node.js](https://nodejs.org/).

5. **Proceed with Installation Steps**:
   - Follow the instructions mentioned in the **Installation** section to set up your project.

If you encounter any issues, feel free to reach out in the [Discord server](https://discord.gg/4kGbBaa).


## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a friendly experience for everyone, regardless of any experience
to give everyone an opportunity to contribute in this project.

### Our Responsibilities

The primary responsibility of contributors is to provide high-quality code contributions to the project. This involves writing, reviewing, and submitting code changes that improve the project's functionality, fix bugs, or implement new features.

Contributors should actively participate in project discussions and communicate effectively with other contributors, maintainers, and users. This includes joining [discord](https://discord.gg/4kGbBaa) server solely created for this project.

Contributors can play a role in the long-term maintenance of the project by actively monitoring the project's issue tracker, addressing bug reports and feature requests, and collaborating with other contributors to ensure the project remains healthy and sustainable.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.
