"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Plus, Smile, Image, X } from "lucide-react";
import { useChat } from "../../contexts/ChatContext";
import EmojiPicker from "../ui/EmojiPicker";

interface MessageInputProps {
  chatId: string;
}

export default function MessageInput({ chatId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { sendMessage, sendTyping } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // use ReturnType<typeof setTimeout> for cross-environment compatibility (browser/node)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || selectedImage) {
      if (selectedImage) {
        // Send image message
        const formData = new FormData();
        formData.append("image", selectedImage);
        formData.append("chatId", chatId);
        if (message.trim()) {
          formData.append("caption", message.trim());
        }

        try {
          setIsUploadingImage(true);
          console.log("Starting image upload...", { selectedImage, chatId });

          const response = await fetch(
            "http://localhost:5000/api/upload-image",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: formData,
            }
          );

          console.log("Upload response status:", response.status);

          if (response.ok) {
            const imageMessage = await response.json();
            console.log("Image uploaded successfully:", imageMessage);

            // Show success animation
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2000);

            // The message is already saved and sent via the upload API
            // No need to send again via Socket.io
          } else {
            const errorData = await response.json();
            console.error(
              "Upload failed with status:",
              response.status,
              "Error:",
              errorData
            );
            throw new Error(errorData.message || "Image upload failed");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
          alert("Failed to upload image. Please try again.");
        } finally {
          setIsUploadingImage(false);
        }

        setSelectedImage(null);
        setImagePreview("");
      } else {
        sendMessage(chatId, message.trim());
      }

      setMessage("");
      handleTyping(false);
    }
  };

  const handleTyping = (typing: boolean) => {
    if (typing !== isTyping) {
      setIsTyping(typing);
      sendTyping(chatId, typing);
    }

    if (typing) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        sendTyping(chatId, false);
      }, 3000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (e.target.value.trim()) {
      handleTyping(true);
    } else {
      handleTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-4 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-xs max-h-40 rounded-lg border border-gray-200 dark:border-gray-700"
          />

          {/* Loading Overlay */}
          {isUploadingImage && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mb-2"></div>
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}

          {/* Success Overlay */}
          {uploadSuccess && (
            <div className="absolute inset-0 bg-green-500 bg-opacity-80 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center text-white">
                <svg
                  className="h-8 w-8 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">Sent!</span>
              </div>
            </div>
          )}

          {!isUploadingImage && !uploadSuccess && (
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 p-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>

        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="w-full py-2 px-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black dark:text-white bg-white dark:bg-gray-700"
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={(!message.trim() && !selectedImage) || isUploadingImage}
          className="shrink-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isUploadingImage ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>

      {/* Emoji Picker */}
      <EmojiPicker
        isOpen={showEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        onClose={() => setShowEmojiPicker(false)}
      />
    </div>
  );
}
