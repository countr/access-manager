# compile typescript to normal javascript

FROM node:16-alpine@sha256:cb4947dc7a87bad89899e53a32d75ae29fe04c35112ea524a395ebc9b199fd4e AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:cb4947dc7a87bad89899e53a32d75ae29fe04c35112ea524a395ebc9b199fd4e AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
