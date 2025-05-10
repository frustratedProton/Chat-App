import { useEffect, useState } from 'react';
import useSocket from './hooks/useSocket';
import useStore from './hooks/store';
import UsernameInput from './components/UsernameInput';
import RoomInput from './components/RoomInput';
import Chat from './components/Chat';

const App = () => {
    const socket = useSocket('http://localhost:3000');
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

    useEffect(() => {
        if (!socket) return;

        socket.on('chatMessage', ({ roomId, username, message }) => {
            addMessage(roomId, { username, message });
        });

        socket.on('roomMessages', ({ roomId, messages }) => {
            clearMessages(roomId);
            messages.forEach((msg) => addMessage(roomId, msg));
        });

        return () => {
            socket.off('chatMessage');
            socket.off('roomMessages');
        };
    }, [socket, addMessage, clearMessages]);

    const joinRoom = () => {
        if (username.trim() && roomId.trim() && socket) {
            socket.emit('joinRoom', { roomId, username });
            clearMessages(roomId);
            setHasJoinedRoom(true);
        }
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
