import { create } from 'zustand';

const useStore = create((set) => ({
    roomId: '',
    message: '',
    username: '',
    messages: {},

    setRoomId: (roomId) => set({ roomId }),

    setMessage: (message) => set({ message }),

    setUsername: (username) => set({ username }),

    addMessage: (roomId, msg) =>
        set((state) => {
            console.log(`Adding message to room: ${roomId}`, msg); // Log the message being added
            return {
                messages: {
                    ...state.messages,
                    [roomId]: [...(state.messages[roomId] || []), msg],
                },
            };
        }),

    clearMessage: () => set({ message: '' }),

    clearMessages: (roomId) =>
        set((state) => ({
            messages: { ...state.messages, [roomId]: [] },
        })),
}));

export default useStore;
