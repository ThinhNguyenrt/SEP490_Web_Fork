import { useState, useEffect } from "react";
import { MessageCircle, Search, Loader2, MoreVertical,  CheckCheck } from "lucide-react";
import ChatDetails from "../chat/ChatDetails";
import { useAppSelector } from "@/store/hook";
import { connectionService, ApiMessageResponse } from "@/services/connection.api";
import { realtimeService, MessageDto, MessagesReadDto, RoomUpdatedDto } from "@/services/realtimeService";
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
  messageRoomId: number;
  description?: string;
  connectionRole?: string;
  isVerified?: boolean;  // Whether the connection is a verified recruiter
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
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState(false);
  const { user, accessToken } = useAppSelector((state) => state.auth);

  // Initialize realtime connections when accessToken changes
  useEffect(() => {
    if (!accessToken) return;

    try {
      realtimeService.initConnection(accessToken);
      realtimeService.start();
      console.log("✅ Realtime service initialized");
    } catch (err) {
      console.error("❌ Failed to initialize realtime service:", err);
    }
  }, [accessToken]);

  // Set up event listeners whenever selectedConversation changes
  useEffect(() => {
    // Listen for real-time message events
    const handleNewMessage = (event: CustomEvent<MessageDto>) => {
      console.log("📨 New message from SignalR:", event.detail);
      const newMessage: Message = {
        id: event.detail.id,
        userId: event.detail.userId,
        messageRoomId: event.detail.messageRoomId,
        content: event.detail.content,
        createdAt: new Date(event.detail.createdAt).toLocaleTimeString("vi-VN"),
        status: event.detail.status,
      };

      // Add to current messages if in the right room
      if (selectedConversation?.messageRoomId === event.detail.messageRoomId) {
        setMessages((prev) => [...prev, newMessage]);
        // Save to localStorage
        saveMessagesToStorage(event.detail.messageRoomId, [
          ...messages,
          newMessage,
        ]);
      }
    };

    // Listen for read status changes
    const handleMessagesRead = (event: CustomEvent<MessagesReadDto>) => {
      console.log("✓ Messages read status updated:", event.detail);
      // Update messages in the current room with read status
      if (selectedConversation?.messageRoomId === event.detail.roomId) {
        setMessages((prev) =>
          prev.map((msg) =>
            event.detail.messageIds.includes(msg.id)
              ? { ...msg, status: "READ" }
              : msg
          )
        );
      }
    };

    // Listen for room updates (sidebar updates)
    const handleRoomUpdated = (event: CustomEvent<RoomUpdatedDto>) => {
      console.log("🔄 Room updated:", event.detail);
      // Update conversations list with new message info
      setConversations((prev) =>
        prev.map((conv) =>
          conv.messageRoomId === event.detail.roomId
            ? {
                ...conv,
                lastMessage: event.detail.lastContent,
                lastMessageTime: new Date(event.detail.lastAt).toLocaleString(
                  "vi-VN"
                ),
              }
            : conv
        )
      );
    };

    window.addEventListener(
      "realtime-message",
      handleNewMessage as EventListener
    );
    window.addEventListener(
      "realtime-messages-read",
      handleMessagesRead as EventListener
    );
    window.addEventListener(
      "realtime-room-updated",
      handleRoomUpdated as EventListener
    );

    // Cleanup listeners
    return () => {
      window.removeEventListener(
        "realtime-message",
        handleNewMessage as EventListener
      );
      window.removeEventListener(
        "realtime-messages-read",
        handleMessagesRead as EventListener
      );
      window.removeEventListener(
        "realtime-room-updated",
        handleRoomUpdated as EventListener
      );
    };
  }, [selectedConversation, messages]);

  // Join/leave room when selecting/unselecting conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const joinRoom = async () => {
      try {
        await realtimeService.joinRoom(selectedConversation.messageRoomId);
      } catch (err) {
        console.error("❌ Failed to join room:", err);
      }
    };

    joinRoom();

    return () => {
      // Leave room when deselecting
      realtimeService.leaveRoom(selectedConversation.messageRoomId);
    };
  }, [selectedConversation]);

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
        console.log("🔍 Raw API response:", rooms);
        console.log("🔍 First room structure:", rooms[0]);
        
        // Convert RoomSummary to Conversation format
        const conversationList: Conversation[] = rooms.map((room, index) => ({
          id: index + 1,
          connectionId: room.userId || room.companyId || room.id || room.roomId,  // Use actual user/company ID
          connectionName: room.name,
          connectionAvatar: room.avatar,
          connectionCoverImage: room.coverImage,
          lastMessage: room.lastContent || "Không có tin nhắn",
          lastMessageTime: room.lastAt 
            ? new Date(room.lastAt).toLocaleString('vi-VN')
            : "Chưa có",
          messageRoomId: room.roomId,
          description: "",
          connectionRole: room.role,
          isVerified: room.isVerified,
        }));
        
        console.log("🔍 Mapped conversations:", conversationList);

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
        console.log("📤 Sending message via SignalR...");
        
        // Use SignalR to send message (NOT REST API)
        await realtimeService.sendMessage(
          selectedConversation.messageRoomId,
          content
        );

        console.log("✅ Message sent via SignalR");
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

  const handleMarkAsRead = async (conversation: Conversation) => {
    if (!accessToken) {
      notify.error("Không có token xác thực");
      return;
    }

    try {
      setMarkingAsRead(true);
      console.log(`📖 Marking messages as read for room ${conversation.messageRoomId}`);
      
      await connectionService.markMessageAsRead(
        conversation.messageRoomId,
        accessToken
      );
      
      console.log("✅ Messages marked as read");
      notify.success("Đã đánh dấu tin nhắn là đã đọc");
      
      // Refresh room summaries to update the UI
      if (user?.id) {
        const rooms = await connectionService.getRoomSummaries(user.id, accessToken);
        const conversationList: Conversation[] = rooms.map((room, index) => ({
          id: index + 1,
          connectionId: room.userId || room.companyId || room.id || room.roomId,  // Use actual user/company ID
          connectionName: room.name,
          connectionAvatar: room.avatar,
          connectionCoverImage: room.coverImage,
          lastMessage: room.lastContent || "Không có tin nhắn",
          lastMessageTime: room.lastAt 
            ? new Date(room.lastAt).toLocaleString('vi-VN')
            : "Chưa có",
          messageRoomId: room.roomId,
          description: "",
          connectionRole: room.role,
          isVerified: room.isVerified,
        }));

        setConversations(conversationList);
      }
      
      setOpenMenuId(null);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Không thể đánh dấu tin nhắn";
      console.error("❌ Error marking as read:", errorMsg);
      notify.error(errorMsg);
    } finally {
      setMarkingAsRead(false);
    }
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
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 group relative ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div 
                  onClick={() => handleSelectConversation(conversation)}
                  className="flex items-center gap-3"
                >
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

                {/* Three-dot Menu Button */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === conversation.id ? null : conversation.id);
                    }}
                    className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === conversation.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenMenuId(null)}
                      ></div>
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-2 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <button
                          onClick={() => handleMarkAsRead(conversation)}
                          disabled={markingAsRead}
                          className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700"
                        >
                          {markingAsRead ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <CheckCheck size={16} />
                          )}
                          <span>Đánh dấu là đã đọc</span>
                        </button>
                      </div>
                    </>
                  )}
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
              connectionCoverImage: selectedConversation.connectionCoverImage,
              lastMessage: selectedConversation.lastMessage,
              lastMessageTime: selectedConversation.lastMessageTime,
              description: "",
              connectionRole: selectedConversation.connectionRole,
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
