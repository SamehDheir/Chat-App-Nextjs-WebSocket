"use client";

import React, { useState } from "react";
import { useChat } from "../../contexts/ChatContext";
import { useAuth } from "../../contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { Search, Plus, Users, MessageCircle } from "lucide-react";

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
  lastMessage?: {
    _id: string;
    sender: {
      _id: string;
      username: string;
      avatar: string;
    };
    content: string;
    createdAt: string;
  };
  lastActivity: string;
  isActive: boolean;
}

interface ChatSidebarProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({
  selectedChatId,
  onChatSelect,
  onNewChat,
}: ChatSidebarProps) {
  const { chats, isLoading } = useChat();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;

    if (chat.chatType === "group") {
      return chat.chatName?.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== user?.id
      );
      return otherParticipant?.username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }
  });

  const getChatTitle = (chat: Chat) => {
    if (chat.chatType === "group") {
      return chat.chatName || "Group Chat";
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== user?.id
      );
      return otherParticipant?.username || "Unknown User";
    }
  };

  const getChatSubtitle = (chat: Chat) => {
    if (chat.lastMessage) {
      const isOwn = chat.lastMessage.sender._id === user?.id;
      const senderName = isOwn
        ? "You"
        : chat.lastMessage.sender.username || "Unknown";
      const content =
        chat.lastMessage.content && chat.lastMessage.content.length > 30
          ? chat.lastMessage.content.substring(0, 30) + "..."
          : chat.lastMessage.content || "";

      return `${senderName}: ${content}`;
    }
    return "No messages yet";
  };

  const getLastActivity = (chat: Chat) => {
    if (chat.lastMessage) {
      return formatDistanceToNow(new Date(chat.lastMessage.createdAt), {
        addSuffix: true,
      });
    }
    return "";
  };

  const getAvatarContent = (chat: Chat) => {
    if (chat.chatType === "group") {
      return <Users className="h-5 w-5" />;
    } else {
      const otherParticipant = chat.participants.find(
        (p) => p._id !== user?.id
      );
      if (otherParticipant?.avatar) {
        return (
          <img
            src={otherParticipant.avatar}
            alt={otherParticipant.username}
            className="w-full h-full rounded-full object-cover"
          />
        );
      }
      return otherParticipant?.username?.substring(0, 2).toUpperCase() || "??";
    }
  };

  const isOnline = (chat: Chat) => {
    if (chat.chatType === "group") return false;
    const otherParticipant = chat.participants.find((p) => p._id !== user?.id);
    return otherParticipant?.isOnline || false;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
          </div>
          <button
            onClick={onNewChat}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 px-4">
            <MessageCircle className="h-8 w-8 text-gray-300 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            {!searchQuery && (
              <button
                onClick={onNewChat}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700"
              >
                Start a new chat
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredChats.map((chat) => (
              <button
                key={chat._id}
                onClick={() => onChatSelect(chat._id)}
                className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                  selectedChatId === chat._id
                    ? "bg-blue-50 border-r-2 border-blue-600"
                    : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                      {getAvatarContent(chat)}
                    </div>
                    {isOnline(chat) && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Chat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getChatTitle(chat)}
                      </h3>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">
                        {getLastActivity(chat)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {getChatSubtitle(chat)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
