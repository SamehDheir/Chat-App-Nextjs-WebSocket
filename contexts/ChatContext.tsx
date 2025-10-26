"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import socketService from "../lib/socket";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  messageType: string;
  imageUrl?: string;
  imageName?: string;
  imageSize?: number;
  createdAt: string;
  isEdited: boolean;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
}

interface Chat {
  _id: string;
  participants: Array<{
    _id: string;
    username: string;
    email: string;
    avatar: string;
    isOnline: boolean;
    lastSeen: string;
  }>;
  chatType: "private" | "group";
  chatName?: string;
  chatDescription?: string;
  chatAvatar?: string;
  admin?: string;
  lastMessage?: Message;
  lastActivity: string;
  isActive: boolean;
}

interface OnlineUser {
  userId: string;
  username: string;
  socketId: string;
}

interface TypingUser {
  userId: string;
  username: string;
  isTyping: boolean;
}

interface ChatContextType {
  chats: Chat[];
  messages: { [chatId: string]: Message[] };
  onlineUsers: OnlineUser[];
  typingUsers: { [chatId: string]: TypingUser[] };
  isLoading: boolean;
  sendMessage: (
    chatId: string,
    content: string,
    messageType?: string,
    imageUrl?: string
  ) => void;
  sendTyping: (chatId: string, isTyping: boolean) => void;
  markAsRead: (chatId: string, messageId: string) => void;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  createPrivateChat: (participantId: string) => Promise<Chat>;
  createGroupChat: (
    chatName: string,
    participantIds: string[],
    chatDescription?: string
  ) => Promise<Chat>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<{ [chatId: string]: Message[] }>({});
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [typingUsers, setTypingUsers] = useState<{
    [chatId: string]: TypingUser[];
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && token) {
      setupSocketListeners();
      loadChats();
    }

    return () => {
      cleanupSocketListeners();
    };
  }, [isAuthenticated, token]);

  const setupSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    // New message listener
    socket.on("newMessage", (data: { chatId: string; message: Message }) => {
      const { chatId, message } = data;
      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), message],
      }));

      // Update chat's last message
      setChats((prev) =>
        prev.map((chat) =>
          chat._id === chatId
            ? { ...chat, lastMessage: message, lastActivity: message.createdAt }
            : chat
        )
      );
    });

    // Online users listener
    socket.on("onlineUsers", (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    // User online/offline listeners
    socket.on(
      "userOnline",
      (userData: { userId: string; username: string; isOnline: boolean }) => {
        setOnlineUsers((prev) => {
          const existing = prev.find((u) => u.userId === userData.userId);
          if (existing) {
            return prev.map((u) =>
              u.userId === userData.userId ? { ...u, ...userData } : u
            );
          }
          return [...prev, { ...userData, socketId: "" }];
        });

        // Update chat participants status
        setChats((prev) =>
          prev.map((chat) => ({
            ...chat,
            participants: chat.participants.map((p) =>
              p._id === userData.userId
                ? { ...p, isOnline: userData.isOnline }
                : p
            ),
          }))
        );
      }
    );

    socket.on(
      "userOffline",
      (userData: {
        userId: string;
        username: string;
        isOnline: boolean;
        lastSeen: string;
      }) => {
        setOnlineUsers((prev) =>
          prev.filter((u) => u.userId !== userData.userId)
        );

        // Update chat participants status
        setChats((prev) =>
          prev.map((chat) => ({
            ...chat,
            participants: chat.participants.map((p) =>
              p._id === userData.userId
                ? {
                    ...p,
                    isOnline: userData.isOnline,
                    lastSeen: userData.lastSeen,
                  }
                : p
            ),
          }))
        );
      }
    );

    // Typing listeners
    socket.on(
      "userTyping",
      (data: { userId: string; username: string; isTyping: boolean }) => {
        // This will be handled per chat room
      }
    );

    // Message read listener
    socket.on(
      "messageRead",
      (data: { messageId: string; readBy: string; readAt: string }) => {
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          Object.keys(updatedMessages).forEach((chatId) => {
            updatedMessages[chatId] = updatedMessages[chatId].map((msg) =>
              msg._id === data.messageId
                ? {
                    ...msg,
                    readBy: [
                      ...msg.readBy,
                      { user: data.readBy, readAt: data.readAt },
                    ],
                  }
                : msg
            );
          });
          return updatedMessages;
        });
      }
    );

    // Chat updated listener
    socket.on(
      "chatUpdated",
      (data: {
        chatId: string;
        lastMessage: Message;
        lastActivity: string;
      }) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === data.chatId
              ? {
                  ...chat,
                  lastMessage: data.lastMessage,
                  lastActivity: data.lastActivity,
                }
              : chat
          )
        );
      }
    );
  };

  const cleanupSocketListeners = () => {
    const socket = socketService.getSocket();
    if (!socket) return;

    socket.off("newMessage");
    socket.off("onlineUsers");
    socket.off("userOnline");
    socket.off("userOffline");
    socket.off("userTyping");
    socket.off("messageRead");
    socket.off("chatUpdated");
  };

  const loadChats = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/chat");
      setChats(response.data.chats);
    } catch (error) {
      console.error("Error loading chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await api.get(`/chat/${chatId}/messages`);
      setMessages((prev) => ({
        ...prev,
        [chatId]: response.data.messages,
      }));
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const sendMessage = (
    chatId: string,
    content: string,
    messageType?: string,
    imageUrl?: string
  ) => {
    socketService.sendMessage(chatId, content, messageType, imageUrl);
  };

  const sendTyping = (chatId: string, isTyping: boolean) => {
    socketService.sendTyping(chatId, isTyping);
  };

  const markAsRead = (chatId: string, messageId: string) => {
    socketService.markAsRead(chatId, messageId);
  };

  const joinChat = (chatId: string) => {
    socketService.joinChat(chatId);
  };

  const leaveChat = (chatId: string) => {
    socketService.leaveChat(chatId);
  };

  const createPrivateChat = async (participantId: string): Promise<Chat> => {
    const response = await api.post("/chat/private", { participantId });
    setChats((prev) => [response.data.chat, ...prev]);
    return response.data.chat;
  };

  const createGroupChat = async (
    chatName: string,
    participantIds: string[],
    chatDescription?: string
  ): Promise<Chat> => {
    const response = await api.post("/chat/group", {
      chatName,
      participantIds,
      chatDescription,
    });
    setChats((prev) => [response.data.chat, ...prev]);
    return response.data.chat;
  };

  const value = {
    chats,
    messages,
    onlineUsers,
    typingUsers,
    isLoading,
    sendMessage,
    sendTyping,
    markAsRead,
    loadChats,
    loadMessages,
    joinChat,
    leaveChat,
    createPrivateChat,
    createGroupChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
