# compile typescript to normal javascript

FROM node:16-alpine@sha256:c00e074fc082a64b5fb81309a06836857e5d257b4ab3ab05b75d88457f5cf4dc AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:c00e074fc082a64b5fb81309a06836857e5d257b4ab3ab05b75d88457f5cf4dc AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
