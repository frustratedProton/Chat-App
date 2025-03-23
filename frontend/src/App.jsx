import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Listen for incoming messages from the server
        socket.on('chatMessage', (msg) => {
            setMessages((prevMessages) => [...prevMessages, msg]);
        });

        // Clean up socket event listener when component unmounts
        return () => {
            socket.off('chatMessage');
        };
    }, []);

    // Send message when form is submitted
    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            socket.emit('chatMessage', message); // Emit the message to the server
            setMessage(''); // Clear the input after sending
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
