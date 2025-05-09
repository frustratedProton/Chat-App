const chatRooms = {};

const handleSocketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);

            if (chatRooms[roomId]) {
                socket.emit('roomMessages', chatRooms[roomId]);
            }
        });

        socket.on('chatMessage', ({ roomId, message }) => {
            if (!chatRooms[roomId]) chatRooms[roomId] = [];
            chatRooms[roomId].push(message);

            io.to(roomId).emit('chatMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default handleSocketConnection;
