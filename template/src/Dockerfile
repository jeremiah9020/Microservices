FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["SERVICEPATH/src/package.json", "SERVICEPATH/src/package-lock.json*", "SERVICEPATH/src/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

RUN rm ../node_modules/shared
RUN mkdir ../node_modules/shared
COPY shared ../node_modules/shared
COPY SERVICEPATH/src .

ENV PORT=SERVICEPORT
EXPOSE SERVICEPORT
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]