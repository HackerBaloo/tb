FROM node

# Copy application files
COPY ./www /usr/src/app
COPY ./package.json /usr/src/app
WORKDIR /usr/src/app

# Install Yarn and Node.js dependencies
RUN npm install --production --silent
RUN npm install supervisor --silent -g

CMD [ "supervisor", "./bin/www" ]

EXPOSE 3030

