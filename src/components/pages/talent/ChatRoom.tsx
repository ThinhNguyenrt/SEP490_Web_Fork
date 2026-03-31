import { useState, useEffect } from "react";
import { MessageCircle, Search } from "lucide-react";
import ChatDetails from "./ChatDetails";
import { useAppSelector } from "@/store/hook";

interface Message {
  id: number;
  userId: number;
  messageRoomId: number;
  content: string;
  createdAt: string;
  status: number;
}

interface Conversation {
  id: number;
  connectionId: number;
  connectionName: string;
  connectionAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  description: string;
  connectionRole: string; // Thêm role của người kết nối
  messageRoomId: number; // ID chung cho cả hai bên để đồng bộ tin nhắn
}

interface ChatRoomProps {
  conversations?: Conversation[];
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

// Initialize sample messages for testing
const initializeSampleMessages = (): void => {
  const sampleConversations = [
    {
      messageRoomId: 1001,
      messages: [
        {
          id: 1,
          userId: 2,
          messageRoomId: 1001,
          content: "Xin chào! Chúng tôi đã xem qua hồ sơ của bạn và rất ấn tượng với kinh nghiệm làm việc.",
          createdAt: "10:30",
          status: 1,
        },
        {
          id: 2,
          userId: 1,
          messageRoomId: 1001,
          content: "Cảm ơn anh/chị! Em rất vui khi nhận được tin nhắn từ Google.",
          createdAt: "10:35",
          status: 1,
        },
        {
          id: 3,
          userId: 2,
          messageRoomId: 1001,
          content: "Chúng tôi có một vị trí Senior Frontend Developer rất phù hợp với bạn. Bạn có quan tâm không?",
          createdAt: "10:40",
          status: 1,
        },
        {
          id: 4,
          userId: 1,
          messageRoomId: 1001,
          content: "Vâng, em rất quan tâm ạ! Cho em xin thêm thông tin về vị trí này được không ạ?",
          createdAt: "10:45",
          status: 1,
        },
      ],
    },
    {
      messageRoomId: 1002,
      messages: [
        {
          id: 1,
          userId: 2,
          messageRoomId: 1002,
          content: "Chào bạn! FPT Software đang tìm kiếm người có kỹ năng React và TypeScript.",
          createdAt: "14:20",
          status: 1,
        },
        {
          id: 2,
          userId: 1,
          messageRoomId: 1002,
          content: "Em có kinh nghiệm 3 năm với React và 2 năm với TypeScript ạ.",
          createdAt: "14:25",
          status: 1,
        },
        {
          id: 3,
          userId: 2,
          messageRoomId: 1002,
          content: "Tuyệt vời! Bạn có thể sắp xếp thời gian phỏng vấn vào thứ 5 tuần này không?",
          createdAt: "14:30",
          status: 1,
        },
      ],
    },
  ];

  sampleConversations.forEach(({ messageRoomId, messages }) => {
    if (!localStorage.getItem(`${STORAGE_KEY_PREFIX}${messageRoomId}`)) {
      saveMessagesToStorage(messageRoomId, messages);
    }
  });
};

export default function ChatRoom({ conversations = mockConversations }: ChatRoomProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  // Initialize sample messages on component mount
  useEffect(() => {
    initializeSampleMessages();
  }, []);

  // Lọc conversations dựa trên role của user
  const filteredByRole = conversations.filter((conv) => {
    if (user?.role === 1) {
      // Nếu là user/talent, chỉ hiển thị tin nhắn từ recruiter
      return conv.connectionRole === 'recruiter';
    } else if (user?.role === 2) {
      // Nếu là recruiter, hiển thị tin nhắn từ user/candidate
      return conv.connectionRole === 'user';
    }
    return true; // Mặc định hiển thị tất cả
  });

  const filteredConversations = filteredByRole.filter((conv) =>
    conv.connectionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowDetails(true);
    // Load messages from localStorage using messageRoomId
    const loadedMessages = loadMessagesFromStorage(conversation.messageRoomId);
    setMessages(loadedMessages);
  };

  const handleSendMessage = (content: string) => {
    if (content.trim() && selectedConversation) {
      const message: Message = {
        id: messages.length + 1,
        userId: 1, // Current user ID
        messageRoomId: selectedConversation.messageRoomId,
        content: content,
        createdAt: new Date().toLocaleTimeString(),
        status: 1,
      };
      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      // Save to localStorage using messageRoomId
      saveMessagesToStorage(selectedConversation.messageRoomId, updatedMessages);
    }
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedConversation(null);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white -mx-4">
      {/* Left Sidebar - Conversations List */}
      <div className="w-[345px] border-r border-gray-200 flex flex-col bg-white">
        {/* Header */}
        <div className="px-4 py-6 border-b border-gray-200">
         
          {/* Search Box */}
          <div className="relative max-w-[198px] ">
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
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation)}
                className={`px-4 py-3 cursor-pointer transition-colors ${
                  selectedConversation?.id === conversation.id
                    ? "bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={conversation.connectionAvatar}
                    alt={conversation.connectionName}
                    className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm truncate">
                      {conversation.connectionName}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conversation.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không có cuộc hội thoại nào
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {showDetails && selectedConversation ? (
          <ChatDetails
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onBack={handleBack}
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

// Mock data for conversations
const mockConversations: Conversation[] = [
  // Công ty và recruiter (dành cho user/talent xem)
  {
    id: 1,
    connectionId: 1,
    connectionName: "Google Inc.",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=google",
    lastMessage: "Chúng tôi rất ấn tượng với hồ sơ của bạn!",
    lastMessageTime: "2 giờ trước",
    description: "Công ty công nghệ hàng đầu thế giới",
    connectionRole: "recruiter",
    messageRoomId: 1001, // Room chung với Nguyễn Văn An
  },
  {
    id: 2,
    connectionId: 2,
    connectionName: "FPT Software",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fpt",
    lastMessage: "Bạn có thời gian phỏng vấn vào thứ 5 không?",
    lastMessageTime: "5 giờ trước",
    description: "Công ty phần mềm hàng đầu Việt Nam",
    connectionRole: "recruiter",
    messageRoomId: 1002, // Room chung với Trần Thị Bình
  },
  {
    id: 3,
    connectionId: 3,
    connectionName: "Phạm Cường - HR Manager",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=phamcuong",
    lastMessage: "Chúng mình đang tìm kiếm Frontend Developer",
    lastMessageTime: "1 ngày trước",
    description: "HR Manager tại VNG Corporation",
    connectionRole: "recruiter",
    messageRoomId: 1003, // Room chung với Lê Hoàng Minh
  },
  {
    id: 4,
    connectionId: 4,
    connectionName: "Microsoft Vietnam",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=microsoft",
    lastMessage: "Hẹn gặp bạn vào ngày mai nhé!",
    lastMessageTime: "1 ngày trước",
    description: "Microsoft Việt Nam",
    connectionRole: "recruiter",
    messageRoomId: 1004, // Room chung với Phạm Thị Diệu
  },
  {
    id: 5,
    connectionId: 5,
    connectionName: "Trần Thu Hà - Talent Acquisition",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=thuha",
    lastMessage: "Package lương của chúng tôi rất hấp dẫn",
    lastMessageTime: "2 ngày trước",
    description: "Talent Acquisition tại Shopee Vietnam",
    connectionRole: "recruiter",
    messageRoomId: 1005, // Room chung với Đặng Văn Em
  },
  {
    id: 6,
    connectionId: 6,
    connectionName: "VNG Corporation",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vng",
    lastMessage: "Cảm ơn bạn đã quan tâm đến vị trí này",
    lastMessageTime: "3 ngày trước",
    description: "Tập đoàn công nghệ VNG",
    connectionRole: "recruiter",
    messageRoomId: 1006, // Room chung với Võ Thị Hương
  },
  {
    id: 7,
    connectionId: 7,
    connectionName: "Nguyễn Minh Tuấn - Head of IT",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minhtuan",
    lastMessage: "Bạn hãy chuẩn bị portfolio để phỏng vấn nhé",
    lastMessageTime: "4 ngày trước",
    description: "Head of IT Department tại Tiki",
    connectionRole: "recruiter",
    messageRoomId: 1007, // Room riêng
  },
  {
    id: 8,
    connectionId: 8,
    connectionName: "Amazon Web Services",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=aws",
    lastMessage: "Chúng tôi có vị trí Cloud Engineer phù hợp với bạn",
    lastMessageTime: "1 tuần trước",
    description: "AWS Vietnam",
    connectionRole: "recruiter",
    messageRoomId: 1008, // Room chung với Hoàng Minh Khoa
  },

  // Ứng viên (dành cho recruiter xem)
  {
    id: 9,
    connectionId: 9,
    connectionName: "Nguyễn Văn An",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvanan",
    lastMessage: "Em rất quan tâm đến vị trí này ạ",
    lastMessageTime: "30 phút trước",
    description: "Frontend Developer - 3 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1001, // Room chung với Google
  },
  {
    id: 10,
    connectionId: 10,
    connectionName: "Trần Thị Bình",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tranthib",
    lastMessage: "Em có thể phỏng vấn bất kỳ lúc nào",
    lastMessageTime: "1 giờ trước",
    description: "Full Stack Developer - 5 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1002, // Room chung với FPT
  },
  {
    id: 11,
    connectionId: 11,
    connectionName: "Lê Hoàng Minh",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lehoangminh",
    lastMessage: "Cảm ơn anh/chị đã xem hồ sơ của em",
    lastMessageTime: "3 giờ trước",
    description: "UI/UX Designer - 2 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1003, // Room chung với Phạm Cường
  },
  {
    id: 12,
    connectionId: 12,
    connectionName: "Phạm Thị Diệu",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=phamdieu",
    lastMessage: "Em đã gửi portfolio qua email rồi ạ",
    lastMessageTime: "5 giờ trước",
    description: "Backend Developer - 4 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1004, // Room chung với Microsoft
  },
  {
    id: 13,
    connectionId: 13,
    connectionName: "Đặng Văn Em",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dangvanem",
    lastMessage: "Em mong được làm việc với công ty",
    lastMessageTime: "1 ngày trước",
    description: "Mobile Developer - 3 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1005, // Room chung với Trần Thu Hà
  },
  {
    id: 14,
    connectionId: 14,
    connectionName: "Võ Thị Hương",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=vohuong",
    lastMessage: "Em sẵn sàng nhận việc ngay ạ",
    lastMessageTime: "2 ngày trước",
    description: "Data Analyst - 2 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1006, // Room chung với VNG
  },
  {
    id: 15,
    connectionId: 15,
    connectionName: "Hoàng Minh Khoa",
    connectionAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hoangkhoa",
    lastMessage: "Em có kinh nghiệm làm việc với team quốc tế",
    lastMessageTime: "3 ngày trước",
    description: "DevOps Engineer - 4 năm kinh nghiệm",
    connectionRole: "user",
    messageRoomId: 1008, // Room chung với AWS
  },
];
