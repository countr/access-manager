# compile typescript to normal javascript

FROM node:16-alpine@sha256:8d0dcbf89ad1a5bc561dd0725a6529c98f83065ba6cdd14e69bc5cc7ac565565 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:8d0dcbf89ad1a5bc561dd0725a6529c98f83065ba6cdd14e69bc5cc7ac565565 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
