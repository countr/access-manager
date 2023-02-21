# compile typescript to normal javascript

FROM node:16-alpine@sha256:59afc9ecaa92110d0fd588a9ef12d982d86e4223c7435185b42ca2a783a61db4 AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:59afc9ecaa92110d0fd588a9ef12d982d86e4223c7435185b42ca2a783a61db4 AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
