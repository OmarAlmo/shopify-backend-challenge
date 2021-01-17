FROM node:latest
WORKDIR /app
COPY package.json /app
RUN yarn install
COPY . /app
CMD ["yarn", "db:migrate", && ,"yarn", "start"] 
