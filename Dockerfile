# compile typescript to normal javascript

FROM node:16-alpine@sha256:2ca257ee86a65e8d7fe6bb0ed3df2e7336b7c5a1662512627c99428beed8bdae AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:2ca257ee86a65e8d7fe6bb0ed3df2e7336b7c5a1662512627c99428beed8bdae AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
