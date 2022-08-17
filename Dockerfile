# compile typescript to normal javascript

FROM node:16-alpine@sha256:9a69aeb1cc34fb8817fe4851fee08ec20fdd432ca03077a9f195aee79a24e8cc AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:9a69aeb1cc34fb8817fe4851fee08ec20fdd432ca03077a9f195aee79a24e8cc AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
