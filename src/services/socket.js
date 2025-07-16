let socket = null;

const getSocketUrl = () => {
  // This logic correctly handles GitHub Codespaces URLs by replacing the
  // frontend port (default 3000) with the backend port (3001).
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = window.location.hostname.replace('-3000', '-3001');
  return `${protocol}//${host}`;
};

export const connectSocket = (token) => {
  // Prevent multiple connections
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log('WebSocket is already connected.');
    return;
  }

  // Append the JWT for authentication
  const socketUrl = `${getSocketUrl()}?token=${token}`;
  console.log(`Attempting to connect to WebSocket at: ${socketUrl}`);

  socket = new WebSocket(socketUrl);

  socket.onopen = () => {
    console.log('✅ WebSocket connection established.');
  };

  socket.onmessage = (event) => {
    console.log('Message from server:', event.data);
    // You can add logic here to update your React state based on server messages
  };

  socket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };

  socket.onclose = (event) => {
    console.log(`WebSocket connection closed: ${event.reason}`);
    socket = null; // Clear the instance on close
  };
};

export const sendSocketMessage = (message) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
  } else {
    console.error('Cannot send message, WebSocket is not connected.');
  }
};