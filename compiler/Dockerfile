# Use lightweight Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install C, C++, Python, and Java only
RUN apk update && apk add --no-cache \
  g++ \
  gcc \
  python3 \
  py3-pip \
  openjdk11

# Set JAVA_HOME environment variable for Java
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk
ENV PATH="$JAVA_HOME/bin:$PATH"

# Copy package files and install Node.js dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose app port (change if needed)
EXPOSE 8000

# Start Node.js app
CMD ["node", "index.js"]
