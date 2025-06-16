#!/bin/bash

# Create deployment directory
mkdir -p deploy

# Copy necessary files
cp index.html deploy/
cp styles.css deploy/
cp ai-detector.js deploy/
cp app.js deploy/

# Create a simple server configuration
cat > deploy/server.js << 'EOL'
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// Handle all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
EOL

# Create package.json for Node.js deployment
cat > deploy/package.json << 'EOL'
{
  "name": "ai-detector",
  "version": "1.0.0",
  "description": "AI Content Detection Tool",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOL

# Create README for deployment
cat > deploy/README.md << 'EOL'
# AI Content Detection Tool - Deployment Guide

## Local Deployment

1. Install Node.js if you haven't already
2. Run these commands:
   ```bash
   npm install
   npm start
   ```
3. Open http://localhost:3000 in your browser

## Static Hosting

You can also deploy this application to any static hosting service:

1. GitHub Pages
2. Netlify
3. Vercel
4. AWS S3
5. Google Cloud Storage

Just upload the following files to your hosting service:
- index.html
- styles.css
- ai-detector.js
- app.js

## Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t ai-detector .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 ai-detector
   ```

## Environment Variables

- PORT: Set the port number (default: 3000)
EOL

# Create Dockerfile
cat > deploy/Dockerfile << 'EOL'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
EOL

echo "Deployment package created in the 'deploy' directory"
echo "To deploy locally:"
echo "1. cd deploy"
echo "2. npm install"
echo "3. npm start" 