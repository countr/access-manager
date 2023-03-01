# compile typescript to normal javascript

FROM node:16-alpine@sha256:95a849eafc573ad0d972fd67c569369e7aa94d55a21ede3b972e3137e5f8e43a AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:95a849eafc573ad0d972fd67c569369e7aa94d55a21ede3b972e3137e5f8e43a AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
