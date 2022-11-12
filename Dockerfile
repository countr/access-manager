# compile typescript to normal javascript

FROM node:16-alpine@sha256:3959f314cbebb4c0dff661ef17207d382bb0c7113fbf6192c0d9ed1ff36a2d86 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:3959f314cbebb4c0dff661ef17207d382bb0c7113fbf6192c0d9ed1ff36a2d86 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
