// Vercel serverless handler
// This file is used by Vercel to handle all requests
// Make sure dist folder exists and is built before deployment
const path = require('path');

// Try to require the built server
let app;
try {
  const serverPath = path.join(__dirname, '../dist/server.js');
  console.log('Loading server from:', serverPath);
  const server = require(serverPath);
  app = server.default || server;
  
  if (!app) {
    throw new Error('App not found in server module');
  }
  
  console.log('Server loaded successfully');
} catch (error) {
  console.error('Error loading server:', error);
  console.error('Stack:', error.stack);
  // Fallback: create a simple Express app that shows build error
  const express = require('express');
  app = express();
  app.get('*', (req, res) => {
    res.status(500).json({ 
      error: 'Server not built. Please run "npm run build" before deployment.',
      details: error.message,
      path: error.path || 'unknown'
    });
  });
}

// Export the Express app for Vercel
module.exports = app;

