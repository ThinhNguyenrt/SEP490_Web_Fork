import { useState, useEffect } from "react";
import { Send, ArrowLeft, Loader2, CheckCheck, Check } from "lucide-react";
import profileIcon from "../../assets/myWeb/profile1 1.png";
import searchIcon from "../../assets/myWeb/magnifying-glass 1.png";
import blockIcon from "../../assets/myWeb/block 1.png";
import deleteIcon from "../../assets/myWeb/delete 1.png";
import coverImage from "../../assets/testImage/coverImagee.png";
import { notify } from "@/lib/toast";

interface Message {
  id: number;
  userId: number;
  messageRoomId: number;
  content: string;
  createdAt: string;
  status: string | number; // Can be string from API or number from local
}

interface Conversation {
  id: number;
  connectionId: number;
  connectionName: string;
  connectionAvatar: string;
  connectionCoverImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  description: string;
  connectionRole: string; // Thêm role của người kết nối
  messageRoomId: number; // ID chung cho cả hai bên để đồng bộ tin nhắn
}

interface UserProfile {
  id: number;
  userId: number;
  email: string;
  status: string;
  createAt: string;
  name: string;
  phone: string;
  coverImage: string;
  avatar: string;
}

interface ChatDetailsProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  onBack: () => void;
  currentUserId?: number;
}

export default function ChatDetails({
  conversation,
  messages,
  onSendMessage,
  onBack,
  currentUserId,
}: ChatDetailsProps) {
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [connectionProfile, setConnectionProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch user profile of connection when conversation changes
  useEffect(() => {
    console.log("📋 Full conversation object:", conversation);
    
    const fetchConnectionProfile = async () => {
      // For now, we'll use the testImage as fallback until backend provides full user data with cover image
      // Once Connection API returns userId, we can fetch the complete profile
      console.log("ℹ️ connectionId:", conversation.connectionId, "is Connection ID, not userId");
      console.log("✅ Using default cover image until API provides user profile data");
    };

    fetchConnectionProfile();
  }, [conversation.connectionId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        setSending(true);
        await onSendMessage(newMessage);
        setNewMessage("");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to send message";
        console.error("❌ Error sending message:", errorMsg);
        notify.error(errorMsg);
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <div className="flex h-full bg-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <img
            src={conversation.connectionAvatar}
            alt={conversation.connectionName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-semibold text-gray-900 text-base">
              {conversation.connectionName}
            </h2>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.userId === currentUserId;
                const isRead = message.status && String(message.status).toUpperCase() !== "UNREAD";
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-end gap-2 max-w-md group">
                      <div
                        className={`flex-1 px-4 py-2.5 rounded-2xl ${
                          isOwnMessage
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1 flex items-center gap-1.5 ${
                            isOwnMessage ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          {message.createdAt}
                          {isOwnMessage && (
                            <span className="ml-1">
                              {isRead ? (
                                <CheckCheck size={12} className="inline" />
                              ) : (
                                <Check size={12} className="inline" />
                              )}
                            </span>
                          )}
                        </p>
                      </div>
                      
                      {/* Read Status Indicator */}
                      {isOwnMessage && (
                        <div className="flex-shrink-0 text-xs">
                          <span className={isRead ? "text-black font-medium" : "text-gray-400 font-medium"}>
                            {isRead ? "Đã đọc" : "Đã gửi"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-400 mt-8">
              Chưa có tin nhắn trong cuộc trò chuyện này
            </p>
          )}
        </div>

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="bg-blue-500 text-white p-2.5 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-[385px] border-l border-gray-200 overflow-y-auto flex flex-col">
        {/* Top Section - White Background */}
        <div className="bg-white px-5 pt-5 h-[255px]">
          {/* Cover Image with padding */}
          <div className="relative w-full h-[120px] rounded-xl overflow-hidden">
            <img
              src={connectionProfile?.coverImage || coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-10 mb-3">
            <div className="relative">
              <img
                src={conversation.connectionAvatar}
                alt={conversation.connectionName}
                className="w-20 h-20 rounded-full object-cover border-[5px] border-white shadow-md"
              />
            </div>
          </div>

          {/* Company Name */}
          <div className="text-center pb-5">
            <h3 className="text-base font-semibold text-gray-900">
              {conversation.connectionName}
            </h3>
          </div>
        </div>

        {/* Bottom Section - Gray Background */}
        <div className="flex-1 bg-[#F3F4F6] px-6 pt-12 pb-6">
          {/* First Group: View Profile & Search */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* View Profile */}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <img src={profileIcon} alt="Profile" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-900">
                Xem trang cá nhân
              </span>
              <svg
                className="ml-auto w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Search in Conversation */}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <img src={searchIcon} alt="Search" className="w-5 h-5" />
              <span className="text-sm font-medium text-gray-900">
                Tìm kiếm trong cuộc trò chuyện
              </span>
              <svg
                className="ml-auto w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Spacing between groups */}
          <div className="h-8"></div>

          {/* Second Group: Block & Delete */}
          <div className="bg-white rounded-lg overflow-hidden shadow-sm">
            {/* Block Conversation */}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <img src={blockIcon} alt="Block" className="w-5 h-5" />
              <span className="text-sm font-medium text-[#FF4848]">
                Chặn cuộc trò chuyện
              </span>
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Delete Conversation */}
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
              <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
              <span className="text-sm font-medium text-[#FF4848]">
                Xóa cuộc trò chuyện
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
