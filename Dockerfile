# compile typescript to normal javascript

FROM node:16-alpine@sha256:f4211c8809277a2b840387070cf5171a9edab3090f18ac5b6b5296bb12995149 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:f4211c8809277a2b840387070cf5171a9edab3090f18ac5b6b5296bb12995149 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
