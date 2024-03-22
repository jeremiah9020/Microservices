FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["UserService/src/package.json", "UserService/src/package-lock.json*", "UserService/src/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

RUN rm ../node_modules/shared
RUN mkdir ../node_modules/shared
COPY shared ../node_modules/shared
RUN cd ../node_modules/shared && npm install --production --silent

COPY UserService/src .

EXPOSE 3006
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]