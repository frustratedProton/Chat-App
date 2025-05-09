import { create } from 'zustand';

const useStore = create((set) => ({
    roomId: '',
    message: '',
    messages: {},

    setRoomId: (roomId) => set({ roomId }),

    setMessage: (message) => set({ message }),

    addMessage: (roomId, msg) =>
        set((state) => ({
            messages: {
                ...state.messages,
                [roomId]: [...(state.messages[roomId] || []), msg],
            },
        })),

    clearMessage: () => set({ message: '' }),

    clearMessages: (roomId) =>
        set((state) => ({
            messages: { ...state.messages, [roomId]: [] },
        })),
}));

export default useStore;
