/**
 * Simple HTTP Server for Panoramic Art Experience
 * 
 * This script creates a local server to serve the panoramic art experience
 * with proper MIME types and caching headers for optimal performance.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root path
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Get the file path
    const filePath = path.join(__dirname, pathname);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Set content type
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>404 - Art Not Found</title>
                        <style>
                            body { 
                                font-family: 'Cinzel', serif; 
                                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #533483 100%);
                                color: #f5f5f5; 
                                display: flex; 
                                justify-content: center; 
                                align-items: center; 
                                height: 100vh; 
                                margin: 0; 
                            }
                            .error-container { text-align: center; }
                            h1 { color: #ffd700; font-size: 3rem; margin-bottom: 1rem; }
                            p { font-size: 1.2rem; margin-bottom: 2rem; }
                            a { color: #ffd700; text-decoration: none; }
                            a:hover { text-decoration: underline; }
                        </style>
                    </head>
                    <body>
                        <div class="error-container">
                            <h1>404 - Art Not Found</h1>
                            <p>The masterpiece you seek has wandered into the mists...</p>
                            <a href="/">Return to the Sacred Gallery</a>
                        </div>
                    </body>
                    </html>
                `);
            } else {
                // Server error
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
            return;
        }
        
        // Set headers for better performance
        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000',
            'Access-Control-Allow-Origin': '*'
        });
        
        res.end(data);
    });
});

// Server configuration
const PORT = process.env.PORT || 8000;
const HOST = 'localhost';

// Start the server
server.listen(PORT, HOST, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🌟 PANORAMIC VOYAGE 🌟                    ║
║                                                              ║
║  🎨 Server is running at: http://${HOST}:${PORT}              ║
║  📱 Open this URL in your browser to experience the magic   ║
║  ⌨️  Press Ctrl+C to stop the server                        ║
║                                                              ║
║  ✨ Welcome to the Grandeur of Art & Human Expression ✨     ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    console.log(`
🎭 The Experience Awaits:
   • Immerse yourself in the cosmic welcome screen
   • Navigate the panoramic Celtic art gallery
   • Discover the universal language of human creativity
   • Experience art as humanity's last true sanctuary

🌍 Remember: Arts and Humanities are the last haven for humans
   with their universality and non-prejudice.
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n✨ Thank you for experiencing the Panoramic Voyage! ✨\n');
    server.close(() => {
        console.log('Server closed gracefully.');
        process.exit(0);
    });
});

// Error handling
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please try a different port:`);
        console.error(`   node server.js --port ${PORT + 1}`);
    } else {
        console.error('❌ Server error:', err);
    }
});