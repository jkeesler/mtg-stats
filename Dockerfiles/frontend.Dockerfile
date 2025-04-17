FROM node:18-alpine
 
WORKDIR /app

COPY ../frontend/ .

WORKDIR /app/frontend

RUN npm install && \
    npm install axios && \
    npm install react-router-dom
  
EXPOSE 3000
 
# Define the command to run your app
CMD ["npm", "start"]