FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["AuthService/src/package.json", "AuthService/src/package-lock.json*", "AuthService/src/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

RUN rm ../node_modules/shared
RUN mkdir ../node_modules/shared
COPY shared ../node_modules/shared
RUN cd ../node_modules/shared && npm install --production --silent

COPY AuthService/src .

EXPOSE 3002
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]