# Use the Microsoft .NET SDK image to build the project
FROM node:18-alpine as build-stage
WORKDIR /frontend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:stable-alpine as serve-stage
COPY --from=build-stage /frontend/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
