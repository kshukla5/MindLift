const http = require('http');
const { WebSocketServer } = require('ws');
const url = require('url');
const jwt = require('jsonwebtoken');
const app = require('./app');

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-that-matches-the-one-in-app.js';

// 1. Create an HTTP server from your Express app
const server = http.createServer(app);

// 2. Create a WebSocket server. 'noServer: true' means we'll handle the upgrade manually.
const wss = new WebSocketServer({ noServer: true });

// 3. Listen for the HTTP 'upgrade' event to intercept WebSocket handshakes
server.on('upgrade', (request, socket, head) => {
  const { query } = url.parse(request.url, true);
  const token = query.token;

  if (!token) {
    // If no token, reject the connection
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  // 4. Verify the JWT from the query parameter
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('WebSocket Auth Error:', err.message);
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // If the token is valid, complete the WebSocket handshake
    wss.handleUpgrade(request, socket, head, (ws) => {
      // Attach the decoded user payload to the connection for future use
      ws.user = decoded;
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws, request) => {
  console.log(`✅ WebSocket client connected: User ID ${ws.user.id}`);

  ws.on('message', (message) => {
    console.log(`Received message from ${ws.user.id}: ${message}`);
    ws.send(`Server acknowledges your message: ${message}`);
  });

  ws.on('close', () => console.log(`❌ WebSocket client disconnected: User ID ${ws.user.id}`));
  ws.on('error', (error) => console.error('WebSocket error:', error));
});

// 5. Start the main server
server.listen(PORT, () => {
  console.log(`🚀 Server with WebSocket support listening on port ${PORT}`);
});
