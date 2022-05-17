FROM node

WORKDIR /app

COPY . .

RUN npm install
RUN npm test
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3000
