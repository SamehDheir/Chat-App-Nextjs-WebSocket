const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// Store active connections
const activeUsers = new Map();

const socketHandler = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(
      `User ${socket.user.username} connected with socket ID: ${socket.id}`
    );

    try {
      // Update user status
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: true,
        socketId: socket.id,
        lastSeen: new Date(),
      });

      // Store active user
      activeUsers.set(socket.userId, {
        socketId: socket.id,
        username: socket.user.username,
        userId: socket.userId,
      });

      // Join user to their chat rooms
      const userChats = await Chat.find({
        participants: socket.userId,
        isActive: true,
      });

      userChats.forEach((chat) => {
        socket.join(chat._id.toString());
      });

      // Broadcast user online status
      socket.broadcast.emit("userOnline", {
        userId: socket.userId,
        username: socket.user.username,
        isOnline: true,
      });

      // Send online users list to the connected user
      const onlineUsers = Array.from(activeUsers.values());
      socket.emit("onlineUsers", onlineUsers);

      // Handle joining a chat room
      socket.on("joinChat", async (chatId) => {
        try {
          const chat = await Chat.findOne({
            _id: chatId,
            participants: socket.userId,
          });

          if (chat) {
            socket.join(chatId);
            console.log(`User ${socket.user.username} joined chat: ${chatId}`);
          }
        } catch (error) {
          console.error("Join chat error:", error);
        }
      });

      // Handle leaving a chat room
      socket.on("leaveChat", (chatId) => {
        socket.leave(chatId);
        console.log(`User ${socket.user.username} left chat: ${chatId}`);
      });

      // Handle sending messages
      socket.on("sendMessage", async (data) => {
        try {
          const { chatId, content, messageType = "text", imageUrl } = data;

          // Validate input
          if (
            !chatId ||
            (!content && !imageUrl) ||
            (content && content.trim() === "")
          ) {
            socket.emit("messageError", { message: "Invalid message data" });
            return;
          }

          // Check if user is participant in the chat
          const chat = await Chat.findOne({
            _id: chatId,
            participants: socket.userId,
          });

          if (!chat) {
            socket.emit("messageError", { message: "Chat not found" });
            return;
          }

          // Create message
          const messageData = {
            sender: socket.userId,
            content: content ? content.trim() : "",
            messageType,
          };

          if (imageUrl) {
            messageData.imageUrl = imageUrl;
          }

          const message = new Message(messageData);

          await message.save();
          await message.populate("sender", "username avatar");

          // Update chat
          chat.messages.push(message._id);
          chat.lastMessage = message._id;
          chat.lastActivity = new Date();
          await chat.save();

          // Send message to all participants in the chat room
          const messageToSend = {
            _id: message._id,
            sender: {
              _id: message.sender._id,
              username: message.sender.username,
              avatar: message.sender.avatar,
            },
            content: message.content,
            messageType: message.messageType,
            createdAt: message.createdAt,
            isEdited: message.isEdited,
          };

          if (message.imageUrl) {
            messageToSend.imageUrl = message.imageUrl;
            messageToSend.imageName = message.imageName;
            messageToSend.imageSize = message.imageSize;
          }

          io.to(chatId).emit("newMessage", {
            chatId,
            message: messageToSend,
          });

          // Emit chat update for sidebar
          const participants = chat.participants.filter(
            (p) => p.toString() !== socket.userId
          );
          participants.forEach((participantId) => {
            const participantSocket = activeUsers.get(participantId.toString());
            if (participantSocket) {
              io.to(participantSocket.socketId).emit("chatUpdated", {
                chatId,
                lastMessage: message,
                lastActivity: chat.lastActivity,
              });
            }
          });
        } catch (error) {
          console.error("Send message error:", error);
          socket.emit("messageError", { message: "Failed to send message" });
        }
      });

      // Handle typing indicators
      socket.on("typing", (data) => {
        const { chatId, isTyping } = data;
        socket.to(chatId).emit("userTyping", {
          userId: socket.userId,
          username: socket.user.username,
          isTyping,
        });
      });

      // Handle message read status
      socket.on("markAsRead", async (data) => {
        try {
          const { chatId, messageId } = data;

          const message = await Message.findById(messageId);
          if (message) {
            const existingRead = message.readBy.find(
              (r) => r.user.toString() === socket.userId
            );
            if (!existingRead) {
              message.readBy.push({
                user: socket.userId,
                readAt: new Date(),
              });
              await message.save();

              // Notify sender that message was read
              socket.to(chatId).emit("messageRead", {
                messageId,
                readBy: socket.userId,
                readAt: new Date(),
              });
            }
          }
        } catch (error) {
          console.error("Mark as read error:", error);
        }
      });

      // Handle disconnect
      socket.on("disconnect", async (reason) => {
        console.log(`User ${socket.user.username} disconnected: ${reason}`);

        try {
          // Update user status
          await User.findByIdAndUpdate(socket.userId, {
            isOnline: false,
            lastSeen: new Date(),
            socketId: "",
          });

          // Remove from active users
          activeUsers.delete(socket.userId);

          // Broadcast user offline status
          socket.broadcast.emit("userOffline", {
            userId: socket.userId,
            username: socket.user.username,
            isOnline: false,
            lastSeen: new Date(),
          });
        } catch (error) {
          console.error("Disconnect error:", error);
        }
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.disconnect();
    }
  });
};

module.exports = socketHandler;
