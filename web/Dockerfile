FROM node:18-alpine

WORKDIR /web

COPY /app/package.json .

RUN npm install

RUN npm i -g serve

COPY /app .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]