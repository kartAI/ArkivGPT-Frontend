# Use the Microsoft .NET SDK image to build the project
FROM node:18-alpine
WORKDIR .

COPY package.json .
COPY public/ ./public/
copy src/ ./src/
RUN npm install

CMD ["npm", "start"]
