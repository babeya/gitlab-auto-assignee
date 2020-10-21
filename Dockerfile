FROM node:14
LABEL org.opencontainers.image.source https://github.com/babeya/gitlab-auto-assignee

COPY . /app

WORKDIR /app

RUN yarn install && yarn build

ENTRYPOINT yarn start 