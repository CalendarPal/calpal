FROM node:lts-alpine as builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

COPY src src

RUN if [ "${NODE_ENV}" != "development" ]; then npm run build; fi
# run this tag in docker-compose with npm run dev command

FROM node:lts-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm install --only=prod

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["npm", "run", "start"]