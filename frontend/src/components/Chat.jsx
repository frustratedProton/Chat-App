const Chat = ({
    socket,
    username,
    roomId,
    messages,
    message,
    setMessage,
    clearMessage,
}) => {
    const sendMessage = (e) => {
        e.preventDefault();
        console.log(
            `RoomID: ${roomId}, username: ${username}, message: ${message}`
        );
        if (message.trim()) {
            console.log(
                `Sending message from ${username} in room ${roomId}: ${message}`
            );
            socket.emit('chatMessage', { roomId, username, message });
            clearMessage();
        }
    };

    return (
        <div>
            <h2>Joined Room: {roomId}</h2>
            <div className="chat-box">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.username}: </strong>
                        {msg.message}
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
};

export default Chat;
