# compile typescript to normal javascript

FROM node:16-alpine@sha256:36f352478ffee4f7c63e2918a3becd86d67a84a49126679ed75e98b663c0158c AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:36f352478ffee4f7c63e2918a3becd86d67a84a49126679ed75e98b663c0158c AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
