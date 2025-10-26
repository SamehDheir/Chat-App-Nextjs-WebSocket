"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../contexts/AuthContext";

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

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
}: MessageBubbleProps) {
  const { user } = useAuth();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getAvatarInitials = (username: string) => {
    return username?.substring(0, 2).toUpperCase() || "??";
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-xs lg:max-w-md ${
          isOwn ? "flex-row-reverse" : "flex-row"
        } items-end space-x-2`}
      >
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <div className="shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-600 mr-2">
            {message.sender.avatar ? (
              <img
                src={message.sender.avatar}
                alt={message.sender.username}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              getAvatarInitials(message.sender.username)
            )}
          </div>
        )}

        {/* Message content */}
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-blue-600 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 rounded-bl-md"
          }`}
        >
          {/* Sender name for group chats and non-own messages */}
          {!isOwn && showAvatar && (
            <p className="text-xs font-medium text-gray-500 mb-1">
              {message.sender.username}
            </p>
          )}

          {/* Message content */}
          {message.messageType === "image" && message.imageUrl ? (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt={message.imageName || "Image"}
                className="max-w-xs max-h-64 rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => {
                  // Open image in full screen
                  window.open(message.imageUrl, "_blank");
                }}
              />
              {message.content && (
                <p className="text-sm mt-2 whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}

          {/* Message time and status */}
          <div
            className={`flex items-center justify-end mt-1 space-x-1 ${
              isOwn ? "text-blue-100" : "text-gray-500"
            }`}
          >
            <span className="text-xs">{formatTime(message.createdAt)}</span>
            {message.isEdited && <span className="text-xs">(edited)</span>}
            {isOwn && (
              <div className="flex">
                {/* Single tick - sent */}
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {/* Double tick - delivered/read */}
                {message.readBy && message.readBy.length > 0 && (
                  <svg
                    className="w-3 h-3 -ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Spacer for own messages */}
        {isOwn && !showAvatar && <div className="w-8" />}
      </div>
    </div>
  );
}
