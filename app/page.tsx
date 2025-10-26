"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { MessageCircle, Users, Zap, Shield } from "lucide-react";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/chat");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Next Chat</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="bg-blue-600 text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect with Anyone, <span className="text-blue-600">Anywhere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Experience real-time messaging like never before. Chat privately or
            create groups with instant notifications and seamless communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/auth/register")}
              className="bg-blue-600 text-white px-8 py-3 text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Chatting Now
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="border border-gray-300 text-gray-700 px-8 py-3 text-lg font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Next Chat?
            </h2>
            <p className="text-xl text-gray-600">
              Built with modern technology for the best chat experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Real-time Messaging
              </h3>
              <p className="text-gray-600">
                Instant message delivery with Socket.io for seamless
                communication
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Group Chats
              </h3>
              <p className="text-gray-600">
                Create and manage group conversations with multiple participants
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600">
                JWT authentication and secure connections protect your
                conversations
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Modern Interface
              </h3>
              <p className="text-gray-600">
                Beautiful, responsive design that works perfectly on all devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Chatting?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of users already connecting on Next Chat
          </p>
          <button
            onClick={() => router.push("/auth/register")}
            className="bg-white text-blue-600 px-8 py-3 text-lg font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Create Your Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-full">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                Next Chat
              </span>
            </div>
          </div>
          <p className="text-center text-gray-400 mt-4">
            © 2024 Next Chat. Built with Next.js and Socket.io.
          </p>
        </div>
      </footer>
    </div>
  );
}
