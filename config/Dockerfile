FROM node:18-slim AS build
WORKDIR /opt/app
COPY . .
RUN\
     corepack enable &&\
     yarn install &&\
     yarn run build &&\
     YARN_PRODUCTION=true yarn install --ignore-scripts --prefer-offline

FROM satantime/puppeteer-node:18-slim

CMD ["yarn", "run", "start"]
WORKDIR /opt/app

COPY --from=build /opt/app /opt/app
COPY --from=build /root/.cache/puppeteer /root/.cache/puppeteer
