FROM node:20-buster-slim AS build
WORKDIR /opt/app
COPY . .
COPY meta/.yarnrc.yml .

RUN\
     corepack install -g yarn@* &&\
     corepack enable &&\
     yarn install &&\
     yarn run build

RUN chown -R node:node /opt/app

FROM satantime/puppeteer-node:20.11.1-buster-slim

CMD ["node", "dist/grafanaReports/main.js"]
WORKDIR /opt/app
USER node

COPY --from=build /opt/app /opt/app
COPY --from=build /root/.cache/puppeteer /home/node/.cache/puppeteer
