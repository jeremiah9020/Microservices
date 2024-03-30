FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["CookbookService/src/package.json", "CookbookService/src/package-lock.json*", "CookbookService/src/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

RUN rm ../node_modules/shared
RUN mkdir ../node_modules/shared
COPY shared ../node_modules/shared
RUN cd ../node_modules/shared && npm install --production --silent

COPY CookbookService/src .

EXPOSE 3003
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]