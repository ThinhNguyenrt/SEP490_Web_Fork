import { useState, useEffect } from "react";
import { MessageCircle, Search, Loader2 } from "lucide-react";
import ChatDetails from "./ChatDetails";
import { useAppSelector } from "@/store/hook";
import { connectionService, ApiMessageResponse } from "@/services/connection.api";
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
  lastMessage: string;
  lastMessageTime: string;
  messageRoomId: number;
}

// Local Storage helpers
const STORAGE_KEY_PREFIX = "chat_messages_room_";

const loadMessagesFromStorage = (messageRoomId: number): Message[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${messageRoomId}`);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading messages from storage:", error);
    return [];
  }
};

const saveMessagesToStorage = (messageRoomId: number, messages: Message[]): void => {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${messageRoomId}`, JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving messages to storage:", error);
  }
};


export default function ChatRoom() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // Fetch room summaries on component mount
  useEffect(() => {
    const fetchRoomSummaries = async () => {
      if (!user?.id || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 Fetching room summaries for user:", user.id);
        
        const rooms = await connectionService.getRoomSummaries(user.id, accessToken);
        
        // Convert RoomSummary to Conversation format
        const conversationList: Conversation[] = rooms.map((room, index) => ({
          id: index + 1,
          connectionId: room.roomId,
          connectionName: room.name,
          connectionAvatar: room.avatar,
          lastMessage: room.lastContent || "Không có tin nhắn",
          lastMessageTime: room.lastAt 
            ? new Date(room.lastAt).toLocaleString('vi-VN')
            : "Chưa có",
          messageRoomId: room.roomId,
        }));

        setConversations(conversationList);
        console.log("✅ Room summaries loaded:", conversationList);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Không thể tải danh sách phòng";
        console.error("❌ Error fetching room summaries:", errorMsg);
        notify.error(errorMsg);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomSummaries();
  }, [user?.id, accessToken]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conv) =>
    conv.connectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowDetails(true);

    // Fetch messages from API
    if (!accessToken) {
      console.warn("⚠️ No access token available");
      setMessages([]);
      return;
    }

    try {
      console.log(`📡 Fetching messages for room ${conversation.messageRoomId}`);
      
      // Call API to fetch messages
      const apiMessages = await connectionService.getMessages(
        conversation.messageRoomId,
        accessToken,
        50 // Limit to last 50 messages
      );

      console.log("✅ Messages fetched from API:", apiMessages);

      // Sort messages by createdAt chronologically (oldest first)
      const sortedApiMessages = [...apiMessages].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      // Convert API response to local Message format
      const convertedMessages: Message[] = sortedApiMessages.map((apiMsg: ApiMessageResponse) => ({
        id: apiMsg.id,
        userId: apiMsg.userId,
        messageRoomId: apiMsg.messageRoomId,
        content: apiMsg.content,
        createdAt: new Date(apiMsg.createdAt).toLocaleTimeString('vi-VN'),
        status: apiMsg.status, // Keep as string from API
      }));

      setMessages(convertedMessages);

      // Also save to localStorage for offline access
      saveMessagesToStorage(conversation.messageRoomId, convertedMessages);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Không thể tải tin nhắn";
      console.error("❌ Error fetching messages:", errorMsg);
      
      // Fallback to localStorage if API fails
      const localMessages = loadMessagesFromStorage(conversation.messageRoomId);
      setMessages(localMessages);
      
      // Only notify if there are no local messages
      if (localMessages.length === 0) {
        notify.error(errorMsg);
      } else {
        console.log("📦 Using cached messages from localStorage");
      }
    }
  };

  const handleSendMessage = async (content: string) => {
    if (content.trim() && selectedConversation && accessToken && user?.id) {
      try {
        console.log("📤 Sending message to API...");
        
        // Call API to send message
        const apiMessage = await connectionService.sendMessage(
          selectedConversation.messageRoomId,
          content,
          accessToken
        );

        console.log("✅ Message sent successfully:", apiMessage);

        // Convert API response to local Message format
        const message: Message = {
          id: apiMessage.id,
          userId: apiMessage.userId,
          messageRoomId: apiMessage.messageRoomId,
          content: apiMessage.content,
          createdAt: new Date(apiMessage.createdAt).toLocaleTimeString('vi-VN'),
          status: apiMessage.status,
        };

        const updatedMessages = [...messages, message];
        setMessages(updatedMessages);

        // Save to localStorage for persistence
        saveMessagesToStorage(selectedConversation.messageRoomId, updatedMessages);
        
        notify.success("Tin nhắn đã được gửi");
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Không thể gửi tin nhắn";
        console.error("❌ Error sending message:", errorMsg);
        notify.error(errorMsg);
        throw error; // Re-throw to let ChatDetails handle the error
      }
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white -mx-4">
      {/* Left Sidebar - Conversations List */}
      <div className="border-r border-gray-200 flex flex-col bg-white" style={{ width: '345px' }}>
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-200">
          {/* Search Box */}
          <div className="relative" style={{ maxWidth: '198px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-50 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <Search className="absolute right-2.5 top-1.5 text-gray-400" size={14} />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="animate-spin text-blue-500 mx-auto mb-2" size={24} />
                <p className="text-sm text-gray-500">Đang tải...</p>
              </div>
            </div>
          ) : filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conversation.connectionAvatar}
                    alt={conversation.connectionName}
                    className="w-11 h-11 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conversation.connectionName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conversation.lastMessageTime}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              {loading ? "Đang tải..." : "Không có cuộc hội thoại nào"}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {showDetails && selectedConversation ? (
          <ChatDetails
            conversation={{
              id: selectedConversation.id,
              connectionId: selectedConversation.connectionId,
              connectionName: selectedConversation.connectionName,
              connectionAvatar: selectedConversation.connectionAvatar,
              lastMessage: selectedConversation.lastMessage,
              lastMessageTime: selectedConversation.lastMessageTime,
              description: "", // No description needed
              connectionRole: "", // No role filtering
              messageRoomId: selectedConversation.messageRoomId,
            }}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
            currentUserId={user?.id}
          />
        ) : (
          /* Default View */
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center max-w-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={40} className="text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hộp thư của bạn
              </h2>
              <p className="text-gray-500 text-sm">
                Hãy chọn một cuộc hội thoại từ danh sách bên trái để bắt đầu cuộc trò chuyện
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
