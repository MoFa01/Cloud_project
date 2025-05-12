# Example Dockerfile
FROM node:18

WORKDIR /app

COPY . .

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

RUN npm install

CMD ["npm", "run", "start"]
