# compile typescript to normal javascript

FROM node:16-alpine@sha256:06f9a824fafa95ee7be07e24e68e47633a95c3bb0f9ae4a0839e99ad9499042c AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:06f9a824fafa95ee7be07e24e68e47633a95c3bb0f9ae4a0839e99ad9499042c AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
