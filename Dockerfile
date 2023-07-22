# syntax = docker/dockerfile:1
ARG NODE_VERSION=20.2.0
FROM node:${NODE_VERSION}-slim as base

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
ARG GITHUB_CLIENT_SECRET
ENV GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
ARG GITHUB_ACCESS_TOKEN
ENV GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

LABEL fly_launch_runtime="Next.js/Prisma"

# Next.js/Prisma app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential openssl 

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci --include=dev

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Copy application code
COPY --link . .

# Seed db
RUN npm run seed

# Run build script
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Install packages needed for deployment
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y openssl && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

# Copy built application
COPY --from=build /app /app

# Entrypoint prepares the database.
ENTRYPOINT [ "/app/docker-entrypoint.js" ]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "npm", "run", "start" ]
