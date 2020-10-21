FROM node:14
MAINTAINER babeya

COPY . /app

WORKDIR /app

RUN yarn install && yarn build

ENTRYPOINT yarn start 