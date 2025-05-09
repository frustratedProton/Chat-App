import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import cors from 'cors';
import handleSocketConnection from './roomManager.js';

const app = express();
const server = createServer(app);

app.use(
    cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    })
);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.send('Chat Server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg); // Broadcast the message to all clients
    });
});

handleSocketConnection(io);

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});
