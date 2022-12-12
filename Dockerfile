# compile typescript to normal javascript

FROM node:16-alpine@sha256:7934825c98a43268785aad119562b49d7e3acf850c8a9a0a027bd7448f4e2b50 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:7934825c98a43268785aad119562b49d7e3acf850c8a9a0a027bd7448f4e2b50 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
