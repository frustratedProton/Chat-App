const UsernameInput = ({ username, setUsername, setIsUsernameSet }) => {
    const setUserAndShowRoomInput = () => {
        if (username.trim()) setIsUsernameSet(true);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={setUserAndShowRoomInput}>
                Set Username and Proceed
            </button>
        </div>
    );
};

export default UsernameInput;
