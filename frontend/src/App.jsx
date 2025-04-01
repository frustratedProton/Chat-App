import { useEffect } from 'react';
import io from 'socket.io-client';
import useStore from './hooks/store';

const socket = io('http://localhost:3000');

function App() {
    const { message, messages, setMessage, setMessages, clearMessage } =
        useStore();

    useEffect(() => {
        socket.on('chatMessage', (msg) => {
            setMessages(msg);
        });

        return () => {
            socket.off('chatMessage');
        };
    }, [setMessages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chatMessage', message); 
            clearMessage();
        }
    };

    return (
        <div className="App">
            <h1>Chat App</h1>
            <div className="chat-box">
                {messages.map((msg, index) => (
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
    );
}

export default App;
