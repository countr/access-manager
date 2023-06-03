# compile typescript to normal javascript

FROM node:16-alpine@sha256:19c07781e9862b47c2d5efa25545203a426053ebbaf1ea4976f731daf5b009bb AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:19c07781e9862b47c2d5efa25545203a426053ebbaf1ea4976f731daf5b009bb AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
