// Vercel serverless handler
// This file is used by Vercel to handle all requests
// Make sure dist folder exists and is built before deployment
const path = require('path');
const fs = require('fs');

// Try multiple paths to find the server
// This handles different Vercel deployment scenarios
const possiblePaths = [
  path.join(__dirname, '../dist/server.js'),  // Relative from api/
  path.join(process.cwd(), 'dist/server.js'), // From root directory
  path.resolve(__dirname, '../dist/server.js'), // Absolute relative
];

let app;
let loadedPath = null;

// Try each path until one works
for (const serverPath of possiblePaths) {
  try {
    const resolvedPath = path.resolve(serverPath);
    console.log('Trying to load server from:', resolvedPath);
    
    // Check if file exists
    if (fs.existsSync(resolvedPath)) {
      console.log('File exists, loading...');
      const server = require(resolvedPath);
      app = server.default || server;
      
      if (app) {
        loadedPath = resolvedPath;
        console.log('✅ Server loaded successfully from:', loadedPath);
        break;
      }
    } else {
      console.log('File does not exist:', resolvedPath);
    }
  } catch (error) {
    console.log('Failed to load from:', serverPath, error.message);
    continue;
  }
}

// If we couldn't load the server, create a fallback
if (!app) {
  console.error('❌ Could not load server from any path. Tried:', possiblePaths);
  const express = require('express');
  app = express();
  
  app.get('*', (req, res) => {
    res.status(500).json({ 
      error: 'Server not found',
      message: 'The server build was not found. Please ensure "npm run build" executed successfully.',
      triedPaths: possiblePaths.map(p => path.resolve(p)),
      cwd: process.cwd(),
      __dirname: __dirname,
      debug: {
        distExists: fs.existsSync(path.join(process.cwd(), 'dist')),
        apiExists: fs.existsSync(path.join(process.cwd(), 'api')),
      }
    });
  });
}

// Export the Express app for Vercel
module.exports = app;

