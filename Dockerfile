# compile typescript to normal javascript

FROM node:16-alpine@sha256:296f32946d2fb5227e43fa51e608bbb11a208d648a833e9b264934fb0c7f404b AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:296f32946d2fb5227e43fa51e608bbb11a208d648a833e9b264934fb0c7f404b AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
