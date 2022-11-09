# compile typescript to normal javascript

FROM node:16-alpine@sha256:868e2b6c8923d87a4bbfb157d757898061c9000aaaedf64472074fa7b62d0e72 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:868e2b6c8923d87a4bbfb157d757898061c9000aaaedf64472074fa7b62d0e72 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
