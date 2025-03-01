FROM node:18-alpine
 
WORKDIR /app
 
COPY ./chess-live/package.json /app/
RUN npm install

COPY ./chess-live/public /app/public
COPY ./chess-live/src /app/src

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]

