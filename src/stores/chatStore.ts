import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: any[];
  timestamp: Date;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentQuery: string;
  language: "en" | "ar";
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setLoading: (loading: boolean) => void;
  setCurrentQuery: (query: string) => void;
  setLanguage: (language: "en" | "ar") => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  currentQuery: "",
  language: "en",
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: crypto.randomUUID(),
          timestamp: new Date(),
        },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  setCurrentQuery: (query) => set({ currentQuery: query }),
  setLanguage: (language) => set({ language }),
  clearMessages: () => set({ messages: [] }),
}));
