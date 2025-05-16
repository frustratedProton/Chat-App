import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(url, {
            withCredentials: true,
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [url]);

    return socket;
};

export default useSocket;
