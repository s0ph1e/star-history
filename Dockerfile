FROM node:14-alpine

#ENV NODE_ENV=production
WORKDIR /app

#COPY ["package.json", "package-lock.json*", "./"]
COPY . .
RUN npm install

#COPY . .

RUN npm run build

CMD [ "node", "server.js" ]
