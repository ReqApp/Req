from node:12

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN  npm install

COPY . /usr/src/app

CMD [ "npm", "start" ]

EXPOSE 3000