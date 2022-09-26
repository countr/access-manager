# compile typescript to normal javascript

FROM node:16-alpine@sha256:699c5bf62c001399493a33ec868d12b4b935adc0638ad37f42c5b10c41236f6b AS builder
RUN apk --no-cache add g++ gcc make python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY ./src ./src
RUN npm run build


# production image

FROM node:16-alpine@sha256:699c5bf62c001399493a33ec868d12b4b935adc0638ad37f42c5b10c41236f6b AS final
RUN apk --no-cache add dumb-init g++ gcc make python3

WORKDIR /app
ENV IS_DOCKER=true

COPY package*.json ./
RUN npm ci --only=production

COPY .env ./.env
COPY --from=builder /app/build ./build

CMD ["dumb-init", "npm", "start"]
