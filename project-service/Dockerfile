# Project service Dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4002

CMD ["node", "src/index.js"]
