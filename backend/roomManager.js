import db from './db.js'; // Import the database instance

const handleSocketConnection = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        db.all('SELECT roomId FROM rooms', [], (err, rows) => {
            if (err) {
                console.error('Error fetching rooms:', err.message);
                return;
            }

            // Emit rooms to the client
            if (rows.length === 0) {
                console.log('No rooms available');
            } else {
                console.log('Rooms fetched:', rows);
                socket.emit('availableRooms', rows); 
            }
        });

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);

            db.all(
                'SELECT username, message, timestamp FROM messages WHERE roomId = ? ORDER BY timestamp ASC',
                [roomId],
                (err, rows) => {
                    if (err) {
                        console.error(
                            'Error fetching room messages:',
                            err.message
                        );
                        return;
                    }
                    socket.emit('roomMessages', rows); 
                }
            );
        });

        socket.on('chatMessage', ({ roomId, username, message }) => {
            // Save the message to the messages table
            console.log(
                `RoomID: ${roomId}, username: ${username}, message: ${message}`
            );
            db.run(
                'INSERT INTO messages (roomId, username, message) VALUES (?, ?, ?)',
                [roomId, username, message],
                (err) => {
                    if (err) {
                        console.error('Error saving message:', err.message);
                        return;
                    }
                    // Emit the message to all users in the room
                    io.to(roomId).emit('chatMessage', { username, message });
                }
            );
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};

export default handleSocketConnection;
