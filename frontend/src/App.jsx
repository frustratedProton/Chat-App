import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import useStore from './hooks/store';

const socket = io('http://localhost:3000', {
    withCredentials: true,
    transports: ['websocket', 'polling'],
});

function App() {
    const {
        roomId,
        message,
        messages,
        setRoomId,
        setMessage,
        addMessage,
        clearMessage,
        clearMessages,
    } = useStore();

    // State to track if the user has joined the room
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);

    useEffect(() => {
        socket.on('chatMessage', ({ roomId, message }) => {
            addMessage(roomId, message);
        });

        socket.on('roomMessages', ({ roomId, messages }) => {
            clearMessages(roomId);
            messages.forEach((msg) => addMessage(roomId, msg));
        });

        return () => {
            socket.off('chatMessage');
            socket.off('roomMessages');
        };
    }, [addMessage, clearMessages]);

    const joinRoom = () => {
        if (roomId.trim()) {
            socket.emit('joinRoom', roomId);
            clearMessages(roomId); // Clear old messages when joining a new room
            setHasJoinedRoom(true); // Set flag to indicate room joined
        }
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && roomId.trim()) {
            socket.emit('chatMessage', { roomId, message });
            clearMessage();
        }
    };

    return (
        <div className="App">
            <h1>Chat App with Rooms</h1>

            {!hasJoinedRoom && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter Room ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                    />
                    <button onClick={joinRoom}>Join Room</button>
                </div>
            )}

            {/* Show Room ID after the user joins */}
            {hasJoinedRoom && (
                <div>
                    <h2>Joined Room: {roomId}</h2>
                    <div className="chat-box">
                        {/* Render older messages if available */}
                        {(messages[roomId] || []).map((msg, index) => (
                            <div key={index} className="message">
                                {msg}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message"
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
