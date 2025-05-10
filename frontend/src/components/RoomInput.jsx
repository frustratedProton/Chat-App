const RoomInput = ({ roomId, setRoomId, joinRoom }) => (
    <div>
        <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>Join Room</button>
    </div>
);

export default RoomInput;
