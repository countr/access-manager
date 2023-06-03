# compile typescript to normal javascript

FROM node:16-alpine@sha256:8d18e32fa398763c07407e9d407c64e6a3c2a18e9fa97362cfde669a6b6161ef AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:8d18e32fa398763c07407e9d407c64e6a3c2a18e9fa97362cfde669a6b6161ef AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
