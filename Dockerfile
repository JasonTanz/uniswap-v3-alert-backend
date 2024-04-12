FROM node:20-alpine

WORKDIR /app

 RUN apk update && \
  apk --no-cache add python3 make g++ && \
  rm -rf /var/cache/apk/*

COPY package.json .

RUN yarn install --slient

RUN yarn add global nodemon 

COPY ./src .

EXPOSE 4000

CMD ["yarn",  "dev"]