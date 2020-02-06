FROM node:11
COPY package.json package.json
RUN yarn
COPY . .
RUN yarn build
CMD yarn start:prod