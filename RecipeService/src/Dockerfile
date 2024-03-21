FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY ["RecipeService/src/package.json", "RecipeService/src/package-lock.json*", "RecipeService/src/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../

RUN rm ../node_modules/shared
RUN mkdir ../node_modules/shared
COPY shared ../node_modules/shared
RUN cd ../node_modules/shared && npm install --production --silent

COPY RecipeService/src .

EXPOSE 3005
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]