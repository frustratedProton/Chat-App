import { useEffect, useState } from 'react';
import useSocket from './hooks/useSocket';
import useStore from './hooks/store';
import UsernameInput from './components/UsernameInput';
import RoomInput from './components/RoomInput';
import Chat from './components/Chat';

const App = () => {
    const socket = useSocket('ws://localhost:3000');
    const {
        roomId,
        message,
        messages,
        username,
        setRoomId,
        setUsername,
        setMessage,
        addMessage,
        clearMessage,
        clearMessages,
    } = useStore();

    const [hasJoinedRoom, setHasJoinedRoom] = useState(false);
    const [isUsernameSet, setIsUsernameSet] = useState(false);
    const [availableRooms, setAvailableRooms] = useState([]); 

    useEffect(() => {
        if (!socket) return;

        socket.on('chatMessage', ({ username, message }) => {
            console.log(`Received message: ${username}: ${message}`);
            addMessage(roomId, { username, message });
        });

        socket.on('roomMessages', ({ roomId, messages }) => {
            clearMessages(roomId);
            messages.forEach((msg) => addMessage(roomId, msg));
        });

        socket.on('availableRooms', (rooms) => {
            setAvailableRooms(rooms);
        });

        return () => {
            socket.off('chatMessage');
            socket.off('roomMessages');
            socket.off('availableRooms');
        };
    }, [socket, addMessage, clearMessages, roomId]);

    const joinRoom = () => {
        if (username.trim() && roomId.trim() && socket) {
            socket.emit('joinRoom', roomId);
            clearMessages(roomId);
            setHasJoinedRoom(true);
        }
    };

    const handleRoomClick = (roomId) => {
        setRoomId(roomId);
        socket.emit('joinRoom', { roomId, username });
        clearMessages(roomId);
        setHasJoinedRoom(true);
    };

    return (
        <div className="App">
            <h1>Chime</h1>
            {!isUsernameSet && !hasJoinedRoom && (
                <UsernameInput
                    username={username}
                    setUsername={setUsername}
                    setIsUsernameSet={setIsUsernameSet}
                />
            )}

            {isUsernameSet && !hasJoinedRoom && (
                <RoomInput
                    roomId={roomId}
                    setRoomId={setRoomId}
                    joinRoom={joinRoom}
                />
            )}

            {isUsernameSet && !hasJoinedRoom && (
                <div>
                    <h2>Available Rooms</h2>
                    <ul>
                        {availableRooms.map((room, index) => (
                            <li
                                key={index}
                                onClick={() => handleRoomClick(room.roomId)}
                            >
                                {room.roomId}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {hasJoinedRoom && (
                <Chat
                    socket={socket}
                    username={username}
                    roomId={roomId}
                    messages={messages[roomId] || []}
                    message={message}
                    setMessage={setMessage}
                    clearMessage={clearMessage}
                />
            )}
        </div>
    );
};

export default App;
