# compile typescript to normal javascript

FROM node:16-alpine@sha256:1298fd170c45954fec3d4d063437750f89802d72743816663664cfe9aa152b4b AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:1298fd170c45954fec3d4d063437750f89802d72743816663664cfe9aa152b4b AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
