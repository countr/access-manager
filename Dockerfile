# compile typescript to normal javascript

FROM node:16-alpine@sha256:66ad21bf5c87492a08f3e86e1e8a2778a78d1662fb6576c288b06fdd99935e12 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:66ad21bf5c87492a08f3e86e1e8a2778a78d1662fb6576c288b06fdd99935e12 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
