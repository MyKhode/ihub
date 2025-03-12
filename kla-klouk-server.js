import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const symbols = ['deer', 'calabash', 'rooster', 'fish', 'crab', 'shrimp']

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Game state management
let gameState = {
  status: 'waiting', // 'waiting' | 'countdown'
  countdown: 10,
  results: null
};

let countdownInterval = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send initial state to new connection
  socket.emit('game-state', gameState);

  // Handle chat messages
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  // Handle dice rolls
  socket.on('roll-dice', () => {
    if (gameState.status !== 'waiting') return;
    
    gameState.status = 'countdown';
    gameState.countdown = 10;
    gameState.results = null;
    
    // Broadcast new state
    io.emit('game-state', gameState);
    
    // Start countdown
    countdownInterval = setInterval(() => {
      gameState.countdown--;
      io.emit('game-state', gameState);
      
      if (gameState.countdown <= 0) {
        clearInterval(countdownInterval);
        gameState.status = 'waiting';
        gameState.results = Array.from({ length: 3 }, () => 
          symbols[Math.floor(Math.random() * symbols.length)]
        );
        
        // Broadcast final state and results
        io.emit('game-state', gameState);
        io.emit('dice-results', gameState.results);
        console.log(`${gameState.results}`);
        
        // Reset state
        // setTimeout(() => {
          gameState.results = null;
          io.emit('game-state', gameState);
        // }, 5000);
      }
    }, 1000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server running on port 3000');
});