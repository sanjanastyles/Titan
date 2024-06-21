# Use Node 16 alpine as parent image
FROM node:16-alpine

# Change the working directory on the Docker image to /app
WORKDIR /app

# Environment variables
ENV PORT=8080
ENV MONGO_URI="mongodb://admin:admin@localhost:27017/"
ENV JWT_SECRET="Some_secret_needs_to_be_decided"
ENV STRIPE_SECRET_KEY="pk_test_51OgSk1SHYwCJi5OxJSX1qFYlZm64WYPBs8NA0Nq37iiGBvOJDYMBVVag2NkPbJvPX1RUTd5lqqCuVHwoN8bcCztY00C3WNmTkp"

# Install necessary packages
RUN apk update && \
    apk add --no-cache bash python3 py3-pip

# Install Python dependencies
RUN pip3 install --upgrade pip && \
    pip3 install virtualenv

# Copy package.json and package-lock.json to the /app directory
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of project files into this image
COPY . .

# Install Python dependencies if requirements.txt is present
COPY requirements.txt ./requirements.txt

RUN pip3 install -r requirements.txt

# Expose application port
EXPOSE 8080

# Start the application
CMD ["npm", "run", "dev"]

