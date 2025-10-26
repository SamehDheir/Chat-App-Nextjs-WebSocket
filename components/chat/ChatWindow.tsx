"use client";

import React, { useEffect, useRef, useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { Phone, Video, MoreVertical, Users } from "lucide-react";

interface ChatWindowProps {
  chatId: string;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    avatar: string;
  };
  content: string;
  messageType: string;
  createdAt: string;
  isEdited: boolean;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
}

export default function ChatWindow({ chatId }: ChatWindowProps) {
  const { messages, chats, loadMessages, markAsRead, joinChat, leaveChat } =
    useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const chat = chats.find((c) => c._id === chatId);
  const chatMessages = messages[chatId] || [];

  useEffect(() => {
    if (chatId) {
      joinChat(chatId);
      loadChatMessages();
    }

    return () => {
      if (chatId) {
        leaveChat(chatId);
      }
    };
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const loadChatMessages = async () => {
    setIsLoading(true);
    try {
      await loadMessages(chatId);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getChatTitle = () => {
    if (!chat) return "Select a chat";

    if (chat.chatType === "group") {
      return chat.chatName || "Group Chat";
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== user?.id
      );
      return otherParticipant?.username || "Unknown User";
    }
  };

  const getChatSubtitle = () => {
    if (!chat) return "";

    if (chat.chatType === "group") {
      return `${chat.participants.length} members`;
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== user?.id
      );
      if (otherParticipant?.isOnline) {
        return "Online";
      } else {
        return `Last seen ${new Date(
          otherParticipant?.lastSeen || ""
        ).toLocaleString()}`;
      }
    }
  };

  const shouldShowAvatar = (message: Message, index: number) => {
    if (message.sender._id === user?.id) return false;
    if (index === 0) return true;

    const prevMessage = chatMessages[index - 1];
    return prevMessage && prevMessage.sender._id !== message.sender._id;
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            Welcome to Next Chat
          </h3>
          <p className="text-gray-500">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
              {chat.chatType === "group" ? (
                <Users className="h-5 w-5" />
              ) : (
                chat.participants
                  .find((p) => p._id !== user?.id)
                  ?.username?.substring(0, 2)
                  ?.toUpperCase() || "??"
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {getChatTitle()}
              </h2>
              <p className="text-sm text-gray-500">{getChatSubtitle()}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <Phone className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <Video className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-6 py-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-4">👋</div>
              <p className="text-gray-500">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {chatMessages.map((message, index) => (
              <MessageBubble
                key={message._id}
                message={message}
                isOwn={message.sender._id === user?.id}
                showAvatar={shouldShowAvatar(message, index)}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <MessageInput chatId={chatId} />
    </div>
  );
}
