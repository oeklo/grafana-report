FROM node:22-bookworm-slim AS build

RUN\
     corepack install -g yarn@* &&\
     corepack enable &&\
     yarn config set --home enableTelemetry 0

WORKDIR /opt/app

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install

COPY . .

RUN yarn run build

FROM satantime/puppeteer-node:22.7-bookworm-slim

CMD ["node", "dist/grafanaReports/main.js"]
WORKDIR /opt/app

COPY --from=build /opt/app /opt/app
COPY --from=build /root/.cache/puppeteer /home/node/.cache/puppeteer
RUN chown node:node /opt/app
USER node
