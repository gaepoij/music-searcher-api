FROM mhart/alpine-node:11

WORKDIR /usr/src/app

ARG SPOTIFY_BASIC_AUTH
ARG LOGIN_REDIRECT_URI
ARG WEB_ORIGIN
ARG CLIENT_ID_SECRET

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

COPY . .

ENV NODE_ENV production
ENV SPOTIFY_BASIC_AUTH=$SPOTIFY_BASIC_AUTH
ENV LOGIN_REDIRECT_URI=$LOGIN_REDIRECT_URI
ENV CLIENT_ID_SECRET=$CLIENT_ID_SECRET

RUN yarn build

CMD ["node", "dist/index.js"]


