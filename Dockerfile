FROM node:12
ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install npm dependencies
COPY package*.json /usr/src/app
RUN npm install

# Copy source files
COPY . /usr/src/app/

# Building app
RUN npm run build
EXPOSE 3000

# Running the app
CMD "npm" "run" "dev"