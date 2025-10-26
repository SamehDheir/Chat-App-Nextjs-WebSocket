"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  ArrowLeft,
  Settings,
  Bell,
  Shield,
  Trash2,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
    location: user?.location || "",
    avatar: user?.avatar || "",
  });

  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();

      // Add profile data
      Object.entries(profileData).forEach(([key, value]) => {
        if (value && key !== "avatar") {
          formData.append(key, value);
        }
      });

      // Add avatar if selected
      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const response = await fetch("http://localhost:5000/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await updateProfile(data.user);
        setIsEditing(false);
        setPreviewAvatar("");
        setSelectedFile(null);
        alert("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    setProfileData({
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      phone: user?.phone || "",
      location: user?.location || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
    setPreviewAvatar("");
    setSelectedFile(null);
  };

  const getAvatarInitials = (username: string) => {
    return username ? username.substring(0, 2).toUpperCase() : "U";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Profile
              </h1>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto">
                    {previewAvatar || profileData.avatar ? (
                      <Image
                        src={previewAvatar || profileData.avatar}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-500 dark:text-gray-400 bg-blue-600 text-white">
                        {getAvatarInitials(profileData.username)}
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <div className="mt-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          username: e.target.value,
                        }))
                      }
                      className="text-xl font-semibold text-center bg-transparent border-b-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profileData.username}
                    </h2>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {profileData.email}
                  </p>
                </div>

                {/* Bio */}
                <div className="mt-4">
                  {isEditing ? (
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      placeholder="Tell us about yourself..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {profileData.bio || "No bio available"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Profile Information
              </h3>

              <div className="space-y-6">
                {/* Username */}
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.username}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Add phone number"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Add location"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {profileData.location || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Join Date */}
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "Recently joined"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Account Settings
              </h3>

              <div className="space-y-4">
                <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Notifications
                    </span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      Privacy & Security
                    </span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      General Settings
                    </span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>

                <button className="flex items-center justify-between w-full p-3 text-left hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <span className="text-red-600 dark:text-red-400">
                      Delete Account
                    </span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
