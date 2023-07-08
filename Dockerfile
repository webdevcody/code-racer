FROM node:20-bullseye
        
WORKDIR /app

COPY . .

RUN npm install

CMD ["npm","run","dev"]



