FROM node:24.8.0-bullseye
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Run import script on startup, then start server
CMD sh -c "npm run import && node server.js"