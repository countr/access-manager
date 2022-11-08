# compile typescript to normal javascript

FROM node:16-alpine@sha256:cc234ef6c5c5cd79c8a48d6dfeeaa5ebf0709927a233f6ea695563769902a350 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:cc234ef6c5c5cd79c8a48d6dfeeaa5ebf0709927a233f6ea695563769902a350 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
