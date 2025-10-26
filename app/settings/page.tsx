"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../contexts/ThemeContext";
import {
  ArrowLeft,
  Moon,
  Sun,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Shield,
  Eye,
  EyeOff,
  Download,
  Trash2,
  User,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [settings, setSettings] = useState({
    notifications: true,
    soundEnabled: true,
    readReceipts: true,
    lastSeen: true,
    profilePhotoVisible: true,
    autoDownload: false,
  });

  const updateSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Settings
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account
            </h3>
            <div className="space-y-4">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Edit Profile
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </button>

              <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 dark:text-white">
                    Change Password
                  </span>
                </div>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Appearance
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === "light" ? (
                    <Sun className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <span className="text-gray-900 dark:text-white">Theme</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {theme === "light" ? "Light mode" : "Dark mode"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    theme === "dark" ? "bg-blue-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      theme === "dark" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.notifications ? (
                    <Bell className="h-5 w-5 text-gray-400" />
                  ) : (
                    <BellOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <span className="text-gray-900 dark:text-white">
                      Push Notifications
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Receive notifications for new messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("notifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.soundEnabled ? (
                    <Volume2 className="h-5 w-5 text-gray-400" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <span className="text-gray-900 dark:text-white">Sound</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Play sound for new messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("soundEnabled")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.soundEnabled
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.soundEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Privacy
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.readReceipts ? (
                    <Eye className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <span className="text-gray-900 dark:text-white">
                      Read Receipts
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Let others know when you've read their messages
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("readReceipts")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.readReceipts
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.readReceipts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-gray-900 dark:text-white">
                      Last Seen
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Show when you were last online
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("lastSeen")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.lastSeen
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.lastSeen ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Storage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Data & Storage
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Download className="h-5 w-5 text-gray-400" />
                  <div>
                    <span className="text-gray-900 dark:text-white">
                      Auto Download
                    </span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Automatically download images and files
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSetting("autoDownload")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoDownload
                      ? "bg-blue-600"
                      : "bg-gray-200 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.autoDownload ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <Trash2 className="h-5 w-5 text-red-500" />
                  <span className="text-red-600 dark:text-red-400">
                    Clear Chat History
                  </span>
                </div>
                <span className="text-red-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
