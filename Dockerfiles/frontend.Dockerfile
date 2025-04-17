FROM node:18-alpine
 
WORKDIR /app

COPY ../frontend/package*.json ./

RUN npm install && \
    npm install axios && \
    npm install react-router-dom

COPY ../frontend/ ./

WORKDIR /app/frontend

EXPOSE 3000
 
# Define the command to run your app
CMD ["npm", "start"]