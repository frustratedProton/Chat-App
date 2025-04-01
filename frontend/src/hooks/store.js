import { create } from 'zustand';

const useStore = create((set) => ({
    message: '',
    messages: [],
    setMessage: (message) => set({ message }),
    setMessages: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
    clearMessage: () => set({ message: '' }),
}));

export default useStore;
