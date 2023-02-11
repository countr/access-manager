# compile typescript to normal javascript

FROM node:16-alpine@sha256:1621ddffc775ccf10dc8710660e70d5bfb8e4ee349b926f133698e6512144b73 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:1621ddffc775ccf10dc8710660e70d5bfb8e4ee349b926f133698e6512144b73 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
