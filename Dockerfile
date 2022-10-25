# compile typescript to normal javascript

FROM node:16-alpine@sha256:308e8c2ceed9182ac9f937ad166978eaab7d30ea2fe9202b24bf1fdaea34d431 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:308e8c2ceed9182ac9f937ad166978eaab7d30ea2fe9202b24bf1fdaea34d431 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
