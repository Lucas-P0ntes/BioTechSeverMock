// Vercel serverless handler
// This file is used by Vercel to handle all requests
const path = require('path');
const fs = require('fs');

// Try multiple paths to find the server
// In Vercel, we copy dist to api/dist during build
const possiblePaths = [
  path.join(__dirname, 'dist/server.js'),     // dist copied to api/dist (PRIMARY)
  path.join(__dirname, '../dist/server.js'),  // Relative from api/ (fallback)
  path.join(process.cwd(), 'dist/server.js'), // From root directory (fallback)
  path.resolve(__dirname, '../dist/server.js'), // Absolute relative (fallback)
];

let app;
let loadedPath = null;

// Try each path until one works
for (const serverPath of possiblePaths) {
  try {
    const resolvedPath = path.resolve(serverPath);
    console.log('[VERCEL] Trying to load server from:', resolvedPath);
    
    // Check if file exists
    if (fs.existsSync(resolvedPath)) {
      console.log('[VERCEL] File exists, loading...');
      const server = require(resolvedPath);
      app = server.default || server;
      
      if (app && typeof app.use === 'function') {
        loadedPath = resolvedPath;
        console.log('[VERCEL] ✅ Server loaded successfully from:', loadedPath);
        break;
      } else {
        console.log('[VERCEL] ⚠️ Loaded but not a valid Express app');
      }
    } else {
      console.log('[VERCEL] File does not exist:', resolvedPath);
    }
  } catch (error) {
    console.log('[VERCEL] Failed to load from:', serverPath, error.message);
    continue;
  }
}

// If we couldn't load the server, create a fallback with detailed error
if (!app) {
  console.error('[VERCEL] ❌ Could not load server from any path');
  const express = require('express');
  app = express();
  
  // Debug endpoint
  app.get('/debug', (req, res) => {
    const cwd = process.cwd();
    const apiDir = __dirname;
    res.json({
      error: 'Server build not found',
      message: 'The server build was not found. Please ensure "npm run build" executed successfully.',
      triedPaths: possiblePaths.map(p => ({
        path: p,
        resolved: path.resolve(p),
        exists: fs.existsSync(path.resolve(p))
      })),
      environment: {
        cwd,
        __dirname: apiDir,
        nodeEnv: process.env.NODE_ENV,
        vercel: process.env.VERCEL,
      },
      debug: {
        distExists: fs.existsSync(path.join(cwd, 'dist')),
        distServerExists: fs.existsSync(path.join(cwd, 'dist', 'server.js')),
        apiExists: fs.existsSync(path.join(cwd, 'api')),
        filesInCwd: fs.existsSync(cwd) ? fs.readdirSync(cwd).slice(0, 10) : 'cwd not found',
        filesInApiDir: fs.existsSync(apiDir) ? fs.readdirSync(apiDir).slice(0, 10) : 'api dir not found',
      }
    });
  });
  
  app.get('*', (req, res) => {
    res.status(500).json({ 
      error: 'Server not found',
      message: 'The server build was not found. Please ensure "npm run build" executed successfully.',
      debug: 'Visit /debug for detailed information'
    });
  });
}

// Export the Express app for Vercel
module.exports = app;

