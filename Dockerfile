# compile typescript to normal javascript

FROM node:16-alpine@sha256:8b90428c108bdce0bc2d9e67e706c79214cded28347bcdb19d7cd6f89298f99c AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:8b90428c108bdce0bc2d9e67e706c79214cded28347bcdb19d7cd6f89298f99c AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
