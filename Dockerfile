FROM node:11

RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 && \
chmod 755 /usr/local/bin/dumb-init

# Create app directory
WORKDIR /usr/src/app



# Install yarn
RUN \
  wget -q -O - https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
  echo "deb http://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list && \
  apt-get update && \
  apt-get install -y yarn

# Install Chromium & Xvfb
RUN \
  wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list && \
  apt-get update && \
  apt-get install -y google-chrome-stable xvfb && \
  rm -rf /var/lib/apt/lists/*


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g chromedriver --unsafe-perm


# Bundle app source
COPY . .

USER node

ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD  npm test