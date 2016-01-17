FROM node:4.2.4
MAINTAINER LeReunionais

RUN npm install -g nodemon

RUN apt-get update
RUN apt-get install libzmq3 -y
RUN apt-get install libzmq3-dev -y
RUN ldconfig

EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003

COPY . /registry
WORKDIR /registry

RUN npm install

CMD npm start
