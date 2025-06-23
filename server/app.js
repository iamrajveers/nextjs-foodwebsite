import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,  
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

//   socket.emit('welcome', `Welcome to the server!`);
  
  socket.broadcast.emit('welcome', `${socket.id} joined the chat.`);

    socket.on('message', (data) => {
    console.log('Received message:', data);
    socket.broadcast.emit("recived-message",data)
    io.emit('receive-emessage', data);
  });   

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('Socket.IO Server is running');
});

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
