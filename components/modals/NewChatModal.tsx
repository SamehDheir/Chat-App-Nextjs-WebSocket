"use client";

import React, { useState, useEffect } from "react";
import { X, Search, User, Users } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import api from "../../lib/api";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewChatModal({ isOpen, onClose }: NewChatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatType, setChatType] = useState<"private" | "group">("private");
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const { createPrivateChat, createGroupChat } = useChat();

  useEffect(() => {
    if (searchQuery.length >= 2) {
      searchUsers();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/user/search?query=${encodeURIComponent(searchQuery)}`
      );
      setSearchResults(response.data.users);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserSelect = (user: User) => {
    if (chatType === "private") {
      setSelectedUsers([user]);
    } else {
      const isSelected = selectedUsers.find((u) => u._id === user._id);
      if (isSelected) {
        setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
      } else {
        setSelectedUsers([...selectedUsers, user]);
      }
    }
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setIsCreating(true);

      if (chatType === "private") {
        await createPrivateChat(selectedUsers[0]._id);
      } else {
        if (!groupName.trim()) {
          alert("Please enter a group name");
          return;
        }
        await createGroupChat(
          groupName.trim(),
          selectedUsers.map((u) => u._id),
          ""
        );
      }

      // Reset form and close modal
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      setGroupName("");
      setChatType("private");
      onClose();
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Failed to create chat. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const getAvatarInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Chat</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Chat type selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setChatType("private")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                chatType === "private"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <User className="h-4 w-4" />
              <span>Private Chat</span>
            </button>
            <button
              onClick={() => setChatType("group")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                chatType === "group"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Group Chat</span>
            </button>
          </div>
        </div>

        {/* Group name input (only for group chats) */}
        {chatType === "group" && (
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Search input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Selected users (for group chats) */}
        {chatType === "group" && selectedUsers.length > 0 && (
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Selected users:</p>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                >
                  <span>{user.username}</span>
                  <button
                    onClick={() => handleUserSelect(user)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        <div className="flex-1 overflow-y-auto max-h-64">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No users found</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {searchResults.map((user) => {
                const isSelected = selectedUsers.find(
                  (u) => u._id === user._id
                );
                return (
                  <button
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            getAvatarInitials(user.username)
                          )}
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.isOnline
                            ? "Online"
                            : `Last seen ${new Date(
                                user.lastSeen
                              ).toLocaleDateString()}`}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="text-blue-600">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChat}
              disabled={
                selectedUsers.length === 0 ||
                isCreating ||
                (chatType === "group" && !groupName.trim())
              }
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating
                ? "Creating..."
                : `Create ${chatType === "private" ? "Chat" : "Group"}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
