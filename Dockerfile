FROM mcr.microsoft.com/devcontainers/javascript-node:22

RUN pwd
WORKDIR /app
RUN pwd

COPY package*.json ./
RUN npm ci


COPY . .  
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]