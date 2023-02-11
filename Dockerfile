# compile typescript to normal javascript

FROM node:16-alpine@sha256:04dda0a1e090395aa37d299896880944fdb6c57cc2d4cc9e05271133e1771640 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:04dda0a1e090395aa37d299896880944fdb6c57cc2d4cc9e05271133e1771640 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
