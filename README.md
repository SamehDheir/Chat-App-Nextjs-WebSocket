# Next Chat - Modern Real-time Messaging Application

A feature-rich, real-time chat application built with Next.js, Socket.io, and MongoDB. Includes image sharing, emoji picker, dark/light mode, user profiles, and comprehensive chat features.

## ✨ New Features Added

### 🎨 Enhanced User Experience

- **Dark/Light Mode Toggle**: Switch between themes with persistent preferences
- **Emoji Picker**: Complete emoji selection with categories and search
- **Image Sharing**: Upload and share images with preview and full-screen view
- **User Profiles**: Detailed profile management with avatar upload and bio editing
- **Settings Page**: Comprehensive settings for notifications, privacy, and preferences

### 🖼️ Image & Media Support

- **Image Upload**: Share photos with captions
- **Image Preview**: Thumbnail preview before sending
- **Full-Screen View**: Click images to view in full screen
- **File Size Limits**: 5MB limit with proper validation
- **Multiple Formats**: Support for all common image formats

### 🎭 Theme & Customization

- **System Theme Detection**: Automatically detect user's preferred theme
- **Persistent Settings**: Theme preference saved to localStorage
- **Dark Mode UI**: All components support dark mode styling
- **Smooth Transitions**: Animated theme switching

### 👤 Advanced Profile Management

- **Avatar Upload**: Upload custom profile pictures
- **Profile Information**: Bio, phone, location, and join date
- **Edit Mode**: In-place editing with save/cancel options
- **Profile Settings**: Comprehensive account management

## 🚀 Core Features

### Authentication & Security

- **User Registration & Login**: Secure authentication with JWT tokens
- **Password Hashing**: Bcrypt encryption for user passwords
- **Protected Routes**: Authentication middleware for secure access
- **Session Management**: Persistent login with token validation

### Real-time Messaging

- **Instant Messaging**: Real-time message delivery using Socket.io
- **Private Chats**: One-on-one conversations between users
- **Group Chats**: Create and manage group conversations
- **Typing Indicators**: See when other users are typing
- **Online/Offline Status**: Real-time user presence indicators
- **Message Status**: Delivery and read receipts with checkmarks
- **Image Messages**: Share images with captions
- **Emoji Support**: Rich emoji picker with search and categories

### User Experience

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Theme Support**: Dark and light mode with system detection
- **User Search**: Find and connect with other users
- **Profile Management**: Comprehensive user profiles with avatars
- **Settings Panel**: Detailed preference management
- **Chat Management**: Create new chats, view chat history

### Technical Features

- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer for image handling and storage
- **API**: RESTful endpoints for all operations
- **WebSocket**: Socket.io for real-time communication
- **Error Handling**: Comprehensive error management
- **TypeScript**: Full type safety for better development experience

## 🛠️ Technology Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework with dark mode
- **Socket.io Client**: Real-time communication
- **Lucide React**: Modern icon library
- **date-fns**: Date manipulation utilities
- **React Context**: State management for auth and themes

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Multer**: File upload handling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing library

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Clone the Repository

```bash
git clone <repository-url>
cd next_chat
```

### Install Dependencies

```bash
# Install main project dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..
```

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nextchat
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nextchat
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:3000
```

### Database Setup

#### Option 1: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service
3. The application will create the database automatically

#### Option 2: MongoDB Atlas (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Replace the MONGODB_URI in server/.env

## 🚀 Running the Application

### Development Mode

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
# Frontend (Next.js)
npm run dev:client

# Backend (Express.js)
npm run dev:server
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🌐 Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **Uploaded Images**: http://localhost:5000/api/uploads/:filename

## 📱 Usage Guide

### Getting Started

1. **Register**: Create a new account with username, email, and password
2. **Login**: Sign in with your credentials
3. **Profile Setup**: Add your bio, avatar, and profile information
4. **Theme Selection**: Choose between dark and light mode
5. **Find Users**: Search for other users to start conversations
6. **Start Chatting**: Create private or group chats and start messaging

### New Features Guide

#### Image Sharing

- Click the **+** button in message input
- Select an image (max 5MB)
- Add an optional caption
- Send the image message

#### Emoji Picker

- Click the **😊** button in message input
- Browse categories or search for emojis
- Click any emoji to add it to your message

#### Dark/Light Mode

- Click the **🌙/☀️** button in the header
- Theme preference is automatically saved
- All components adapt to the selected theme

#### Profile Management

- Click your avatar → **Profile**
- Edit your information in-place
- Upload a custom avatar
- Save changes with the **Save** button

#### Settings

- Click your avatar → **Settings**
- Configure notifications, privacy, and preferences
- Toggle various features on/off
- Access account management options

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Users

- `GET /api/user/search` - Search users
- `GET /api/user/online` - Get online users

### Chats

- `GET /api/chat` - Get user's chats
- `POST /api/chat` - Create new chat
- `GET /api/chat/:id/messages` - Get chat messages
- `POST /api/chat/:id/messages` - Send message

### File Upload (New)

- `POST /api/upload-image` - Upload image for messages
- `GET /api/uploads/:filename` - Serve uploaded images

## 🎯 Socket Events

### Client to Server

- `join_chat` - Join a chat room
- `leave_chat` - Leave a chat room
- `send_message` - Send a new message
- `typing` - Send typing indicator

### Server to Client

- `message_received` - New message in chat
- `user_typing` - User typing indicator
- `user_online` - User came online
- `user_offline` - User went offline

## 🎨 Customization

### Theme Customization

The application supports full dark/light mode theming:

- Configure in `tailwind.config.js`
- Dark mode classes: `dark:bg-gray-800`, `dark:text-white`
- Theme context in `contexts/ThemeContext.tsx`

### Styling

- Colors and themes in `tailwind.config.js`
- Global styles in `app/globals.css`
- Component-specific styles with Tailwind classes

### Adding Features

1. Update database models in `server/models/`
2. Create API routes in `server/routes/`
3. Add frontend components in `components/`
4. Update socket events in `server/socket/socketHandler.js`

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt with salt rounds
- **File Upload Security**: Type validation and size limits
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Server-side validation for all inputs
- **Protected Routes**: Authentication middleware for sensitive endpoints

## 🐛 Troubleshooting

### Common Issues

**Image Upload Issues**

- Check file size (max 5MB)
- Ensure uploads folder exists in server directory
- Verify multer configuration

**Theme Issues**

- Clear localStorage if theme stuck
- Check dark mode classes in Tailwind config
- Verify theme context provider wrapping

**Connection Issues**

- Ensure MongoDB is running
- Check environment variables
- Verify port availability (3000, 5000)

**Socket.io Issues**

- Check CORS configuration
- Verify socket URL in frontend
- Ensure both client and server are running

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Socket.io for real-time communication
- MongoDB for the flexible database
- Tailwind CSS for the utility-first styling
- Multer for file upload handling
- All contributors and the open-source community

## 🔮 Planned Enhancements

- **File Sharing**: Document and video uploads
- **Voice Messages**: Record and send audio messages
- **Video Calling**: Peer-to-peer video calls
- **Message Reactions**: React to messages with emojis
- **Message Forwarding**: Forward messages between chats
- **Push Notifications**: Browser and mobile notifications
- **Message Encryption**: End-to-end encryption
- **Chat Backup**: Export and backup conversations
- **Advanced Search**: Search within conversations
- **Message Scheduling**: Send messages at specific times
- **User Blocking**: Block and report users
- **Chat Themes**: Custom chat themes and wallpapers

---

**Built with ❤️ using Next.js, Socket.io, MongoDB, and modern web technologies**

### 📊 Project Stats

- **Frontend Components**: 15+ React components
- **Backend Routes**: 10+ API endpoints
- **Database Models**: 4 MongoDB schemas
- **Real-time Events**: 8+ Socket.io events
- **UI Features**: Dark/Light mode, Image sharing, Emoji picker
- **Security**: JWT auth, File validation, CORS protection

## Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd next_chat
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Set up environment variables**

   Create `.env.local` in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

   Create `.env` in the server directory:

   ```env
   NODE_ENV=development
   PORT=5000
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/next_chat
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   ```

5. **Start MongoDB**
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the connection string in the server `.env` file.

6. **Start the backend server**

   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend development server**

   ```bash
   # In a new terminal, from the root directory
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
next_chat/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── chat/              # Main chat interface
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── chat/             # Chat-related components
│   └── modals/           # Modal components
├── contexts/             # React context providers
├── lib/                  # Utility libraries
├── server/               # Backend Node.js application
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io handlers
│   ├── middleware/      # Express middleware
│   └── index.js         # Server entry point
└── public/              # Static assets
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Chat Management

- `GET /api/chat` - Get user's chats
- `POST /api/chat/private` - Create private chat
- `POST /api/chat/group` - Create group chat
- `GET /api/chat/:chatId/messages` - Get chat messages
- `POST /api/chat/:chatId/messages` - Send message
- `DELETE /api/chat/:chatId` - Delete chat

### User Management

- `GET /api/user/search` - Search users
- `GET /api/user/online` - Get online users
- `PUT /api/user/profile` - Update user profile

## Socket.io Events

### Client to Server

- `joinChat` - Join a chat room
- `leaveChat` - Leave a chat room
- `sendMessage` - Send a message
- `typing` - Send typing indicator
- `markAsRead` - Mark message as read

### Server to Client

- `newMessage` - Receive new message
- `userOnline` - User came online
- `userOffline` - User went offline
- `userTyping` - User typing indicator
- `messageRead` - Message read confirmation
- `chatUpdated` - Chat information updated

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Backend (Railway/Heroku)

1. Create a new app on your chosen platform
2. Add environment variables
3. Connect to MongoDB Atlas for production database
4. Deploy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements

- [ ] File and image sharing
- [ ] Voice and video calls
- [ ] Push notifications
- [ ] Message encryption
- [ ] Message reactions and emojis
- [ ] User status customization
- [ ] Dark mode theme
- [ ] Mobile app with React Native

## Support

If you encounter any issues or have questions, please create an issue in the GitHub repository.
