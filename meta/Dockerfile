FROM node:20-buster-slim AS build

RUN\
     corepack install -g yarn@* &&\
     corepack enable

WORKDIR /opt/app

COPY package.json .
COPY yarn.lock .
COPY meta/.yarnrc.yml .

RUN yarn install --immutable


COPY . .

RUN yarn run build

FROM satantime/puppeteer-node:20.11.1-buster-slim

CMD ["node", "dist/grafanaReports/main.js"]
WORKDIR /opt/app

COPY --from=build /opt/app /opt/app
COPY --from=build /root/.cache/puppeteer /home/node/.cache/puppeteer
RUN chown node:node /opt/app
USER node
