# compile typescript to normal javascript

FROM node:16-alpine@sha256:b66869a9dc6bfeed416395c2a2f717bd1779af1cef828fe7941af3a8d0837fdc AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:b66869a9dc6bfeed416395c2a2f717bd1779af1cef828fe7941af3a8d0837fdc AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
