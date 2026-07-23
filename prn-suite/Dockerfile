FROM node:18.15

RUN npm install -g npm@9.5.1

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# RUN npm cache clean --force

# RUN apt-get update && apt-get install -y libglu1

RUN npm install --legacy-peer-deps
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN npm run build

CMD [ "npm", "run", "start" ]
