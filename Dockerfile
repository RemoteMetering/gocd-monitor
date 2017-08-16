FROM node:boron

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Bundle app source
COPY . /app

RUN npm install
RUN npm run postinstall
CMD [ "npm", "start" ]
