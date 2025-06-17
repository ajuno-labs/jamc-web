# Contributing to JAMC

Thank you for your interest in contributing!

## Setup Options

### 1. Local development

1. Fork and clone the repository.
2. Run `./setup.sh` from the project root. The script installs `pnpm`, copies `.env.example` to `.env.local`, installs Node.js dependencies, sets up PostgreSQL and runs database migrations and seeds.
3. Review `.env.local` and adjust values if necessary.
4. Start the development server:
   ```bash
   pnpm dev
   ```

### 2. Docker Compose

If you prefer using containers, a `compose.yaml` file is provided.

1. Ensure Docker and Docker Compose are installed.
2. Copy `.env.example` to `.env.local` and edit any values you need.
3. Start the services:
   ```bash
   docker compose up -d
   ```
   This launches PostgreSQL, Adminer and the Python similarity service. Run the Next.js app locally with `pnpm dev` or build it using the provided `Dockerfile` if you want to run it in a container.

## Useful Commands

- **Linting**: `pnpm lint`
- **End-to-end tests**: `pnpm test:e2e`
- **Reset the database**: `pnpm db:reset`

## Pull Requests

1. Create a feature branch based on `main`.
2. Commit your changes with clear messages.
3. Ensure `pnpm lint` and tests run successfully before opening a pull request.
4. Open a PR on GitHub and describe your changes.

Thanks again for contributing!
