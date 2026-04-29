import * as signalR from "@microsoft/signalr";
// Định dạng Event trả về từ SignalR Hub
export interface CommentCreatedEvent {
  postId: number;
  commentId: number;
  content: string;
  createdAt: string;
  userId: number;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
}

export interface ReplyCreatedEvent {
  postId: number;
  commentId: number;
  parentCommentId: number;
  replyToUserId: number;
  userId: number;
  content: string;
  createdAt: string;
}
export interface NotificationEvent {
  notificationId: number;
  userId: number;
  type: "like" | "comment" | "group";
  content: string;
  createdAt: string;
  actorName?: string;
  actorAvatar?: string;
}

// Chat-related interfaces
export interface MessageDto {
  id: number;
  messageRoomId: number;
  userId: number;
  content: string;
  createdAt: string;
  status: string;
}

export interface MessagesReadDto {
  roomId: number;
  userId: number;
  messageIds: number[];
}

export interface RoomUpdatedDto {
  roomId: number;
  profileId: number;
  lastContent: string;
  lastAt: string;
  unreadCount: number;
}

class RealtimeService {
  private notifyConnection: signalR.HubConnection | null = null;
  private chatConnection: signalR.HubConnection | null = null;
  private watchingPostIds = new Set<string>();

  // Khởi tạo kết nối
  public initConnection(accessToken: string) {
    if (this.notifyConnection || this.chatConnection) return;

    // Use proxy URLs in development, full URLs in production
    const chatHubUrl = `/hubs/chat`;
    const notifyHubUrl = `/hubs/realtime`;

    // 1. Khởi tạo Chat Connection (Cho Chat Service)
    this.chatConnection = new signalR.HubConnectionBuilder()
      .withUrl(chatHubUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // 2. Khởi tạo Notify Connection (Cho Realtime Service)
    this.notifyConnection = new signalR.HubConnectionBuilder()
      .withUrl(notifyHubUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.notifyConnection || !this.chatConnection) return;

    // ===== CHAT HUB EVENT HANDLERS =====
    this.chatConnection.on("ReceiveMessage", (messageDto: MessageDto) => {
      console.log("💬 New message received:", messageDto);
      window.dispatchEvent(
        new CustomEvent("realtime-message", { detail: messageDto }),
      );
    });

    this.chatConnection.on("MessagesRead", (data: MessagesReadDto) => {
      console.log("✓ Messages read:", data);
      window.dispatchEvent(
        new CustomEvent("realtime-messages-read", { detail: data }),
      );
    });

    this.chatConnection.on("RoomUpdated", (roomData: RoomUpdatedDto) => {
      console.log("🔄 Room updated:", roomData);
      window.dispatchEvent(
        new CustomEvent("realtime-room-updated", { detail: roomData }),
      );
    });

    // ===== NOTIFY HUB EVENT HANDLERS =====
    this.notifyConnection.on("ReceiveComment", (event) => {
      window.dispatchEvent(
        new CustomEvent("realtime-comment", { detail: event }),
      );
    });

    this.notifyConnection.on("ReceiveReply", (event) => {
      window.dispatchEvent(
        new CustomEvent("realtime-reply", { detail: event }),
      );
    });
    this.notifyConnection.on("ReceivePostFavoriteChanged", (data) => {
      window.dispatchEvent(
        new CustomEvent("realtime-favorite", { detail: data }),
      );
    });
    this.notifyConnection.on("ReceiveNotification", (event: NotificationEvent) => {
      console.log("🔔 New notification:", event);
      window.dispatchEvent(
        new CustomEvent("realtime-notification", { detail: event }),
      );
    });
  }

  async start() {
    try {
      // Start both connections
      const promises = [];

      if (this.chatConnection?.state === signalR.HubConnectionState.Disconnected) {
        promises.push(this.chatConnection.start());
      }

      if (this.notifyConnection?.state === signalR.HubConnectionState.Disconnected) {
        promises.push(this.notifyConnection.start());
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        console.log("🚀 SignalR Connected (Chat + Notify)");
      }
    } catch (err) {
      console.error("❌ Connection failed:", err);
      setTimeout(() => this.start(), 5000);
    }
  }

  // services/realtimeService.ts
  async joinPost(postId: string) {
    // Đợi cho đến khi kết nối thực sự sẵn sàng
    if (this.notifyConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn("⏳ Đang đợi kết nối để JoinPost...");
      setTimeout(() => this.joinPost(postId), 10000);
      return;
    }

    try {
      await this.notifyConnection.invoke("JoinPost", postId);
      console.log(`✅ Đã Join thành công Group: post_${postId}`);
    } catch (err) {
      console.error("❌ JoinPost failed:", err);
    }
  }

  async leavePost(postId: number | string) {
    const id = String(postId);
    if (this.notifyConnection?.state === signalR.HubConnectionState.Connected) {
      await this.notifyConnection.invoke("LeavePost", id);
      this.watchingPostIds.delete(id);
    }
  }

  // ===== CHAT HUB METHODS =====
  /**
   * Join a chat room (called when opening 1-1 chat to receive messages)
   */
  async joinRoom(roomId: number) {
    if (this.chatConnection?.state !== signalR.HubConnectionState.Connected) {
      console.warn("⏳ Chat connection not ready, retrying JoinRoom...");
      setTimeout(() => this.joinRoom(roomId), 2000);
      return;
    }

    try {
      await this.chatConnection.invoke("JoinRoom", roomId);
      console.log(`✅ Joined chat room: ${roomId}`);
    } catch (err) {
      console.error("❌ JoinRoom failed:", err);
    }
  }

  /**
   * Leave a chat room
   */
  async leaveRoom(roomId: number) {
    if (this.chatConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.chatConnection.invoke("LeaveRoom", roomId);
        console.log(`✅ Left chat room: ${roomId}`);
      } catch (err) {
        console.error("❌ LeaveRoom failed:", err);
      }
    }
  }

  /**
   * Send a message via SignalR (NOT REST API)
   * Hệ thống sẽ tự động lưu DB và broadcast
   */
  async sendMessage(roomId: number, content: string) {
    if (this.chatConnection?.state !== signalR.HubConnectionState.Connected) {
      console.error("❌ Chat connection not ready");
      throw new Error("Chat connection not ready");
    }

    try {
      console.log(`💬 Sending message to room ${roomId}`);
      await this.chatConnection.invoke("SendMessage", roomId, content);
      console.log("✅ Message sent via SignalR");
    } catch (err) {
      console.error("❌ SendMessage failed:", err);
      throw err;
    }
  }

  stop() {
    this.chatConnection?.stop();
    this.notifyConnection?.stop();
    this.chatConnection = null;
    this.notifyConnection = null;
  }
}

export const realtimeService = new RealtimeService();
