# compile typescript to normal javascript

FROM node:16-alpine@sha256:e26b32c5dbc3660a855c550f43e802d3899b1ed682b298d7862f2da598fa298d AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:e26b32c5dbc3660a855c550f43e802d3899b1ed682b298d7862f2da598fa298d AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
