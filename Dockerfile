# compile typescript to normal javascript

FROM node:16-alpine@sha256:c23ebe44ddb93e89e753ff6a1a52a15495c3c7b7174c49b53a44a46ebc5c0caf AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:c23ebe44ddb93e89e753ff6a1a52a15495c3c7b7174c49b53a44a46ebc5c0caf AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
