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

export interface NotificationDto {
  notificationId: number;
  userId: string;
  title: string;
  content: string;
  type: string;
  category?: "system" | "community";
  objectId?: string;
  isRead: boolean;
  createdAt: string;
}

class RealtimeService {
  private notifyConnection: signalR.HubConnection | null = null;
  private chatConnection: signalR.HubConnection | null = null;
  private watchingPostIds = new Set<string>();

  // Public getter for notifyConnection (for setting up event listeners externally)
  public getNotifyConnection(): signalR.HubConnection | null {
    return this.notifyConnection;
  }

  // Get connection status for debugging and UI feedback
  public getConnectionStatus() {
    return {
      chat: {
        state: this.chatConnection?.state,
        isConnected: this.chatConnection?.state === signalR.HubConnectionState.Connected,
        stateLabel: this.chatConnection ? signalR.HubConnectionState[this.chatConnection.state] : 'Not initialized',
      },
      notify: {
        state: this.notifyConnection?.state,
        isConnected: this.notifyConnection?.state === signalR.HubConnectionState.Connected,
        stateLabel: this.notifyConnection ? signalR.HubConnectionState[this.notifyConnection.state] : 'Not initialized',
      },
    };
  }

  // Khởi tạo kết nối
  public initConnection(accessToken: string) {
    if (this.notifyConnection || this.chatConnection) return;

    // Determine hub URLs based on environment
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Use proxy URLs in development, full URLs in production
    const chatHubUrl = isDev 
      ? `/hubs/chat`
      : `https://gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/hubs/chat`;
    
    const notifyHubUrl = isDev 
      ? `/hubs/realtime`
      : `https://gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/hubs/realtime`;

    console.log(`🔌 [RealtimeService] Initializing connections in ${isDev ? 'DEV' : 'PROD'} mode`);
    console.log(`📡 Chat Hub URL: ${chatHubUrl}`);
    console.log(`📡 Notify Hub URL: ${notifyHubUrl}`);

    // 1. Khởi tạo Chat Connection (Cho Chat Service)
    this.chatConnection = new signalR.HubConnectionBuilder()
      .withUrl(chatHubUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // 2. Khởi tạo Notify Connection (Cho Realtime Service)
    this.notifyConnection = new signalR.HubConnectionBuilder()
      .withUrl(notifyHubUrl, {
        accessTokenFactory: () => accessToken,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling,
        withCredentials: true,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.notifyConnection || !this.chatConnection) return;

    // ===== CHAT CONNECTION STATE HANDLERS =====
    this.chatConnection.onclose((error?: Error) => {
      console.warn("🔌 Chat connection closed:", error?.message || "No error message");
    });

    this.chatConnection.onreconnected((connectionId?: string) => {
      console.log("✅ Chat connection reconnected:", connectionId);
      window.dispatchEvent(new CustomEvent("realtime-connection-ready"));
    });

    this.chatConnection.onreconnecting((error?: Error) => {
      console.warn("🔄 Chat connection reconnecting...", error?.message || "");
    });

    // ===== NOTIFY CONNECTION STATE HANDLERS =====
    this.notifyConnection.onclose((error?: Error) => {
      console.warn("🔌 Notify connection closed:", error?.message || "No error message");
    });

    this.notifyConnection.onreconnected((connectionId?: string) => {
      console.log("✅ Notify connection reconnected:", connectionId);
      window.dispatchEvent(new CustomEvent("realtime-connection-ready"));
    });

    this.notifyConnection.onreconnecting((error?: Error) => {
      console.warn("🔄 Notify connection reconnecting...", error?.message || "");
    });

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
    // System notifications
    this.notifyConnection.on("ReceiveSystemNotification", (event: NotificationDto) => {
      console.log("🔔 [SystemNotification] New system notification:", event);
      window.dispatchEvent(
        new CustomEvent("realtime-system-notification", { detail: event }),
      );
    });

    // Community notifications
    this.notifyConnection.on("ReceiveCommunityNotification", (event: NotificationDto) => {
      console.log("🔔 [CommunityNotification] New community notification:", event);
      window.dispatchEvent(
        new CustomEvent("realtime-community-notification", { detail: event }),
      );
    });

    // Fallback generic notification (backward compatibility)
    this.notifyConnection.on("ReceiveNotification", (event: NotificationDto) => {
      console.log("🔔 [Fallback] New notification:", event);
      if (event.category === "community") {
        window.dispatchEvent(
          new CustomEvent("realtime-community-notification", { detail: event }),
        );
      } else {
        window.dispatchEvent(
          new CustomEvent("realtime-system-notification", { detail: event }),
        );
      }
    });
  }

  async start() {
    try {
      // Start both connections
      const promises = [];

      if (this.chatConnection?.state === signalR.HubConnectionState.Disconnected) {
        console.log("📡 Starting chat connection...");
        promises.push(this.chatConnection.start());
      }

      if (this.notifyConnection?.state === signalR.HubConnectionState.Disconnected) {
        console.log("📡 Starting notify connection...");
        promises.push(this.notifyConnection.start());
      }

      if (promises.length > 0) {
        await Promise.all(promises);
        console.log("🚀 SignalR Connected (Chat + Notify)");
        // Dispatch event to notify listeners
        window.dispatchEvent(new CustomEvent("realtime-connection-ready"));
      }
    } catch (err: unknown) {
      // Check if error is due to service being unavailable (e.g., Container App stopped)
      const errorMsg = err instanceof Error ? err.message : (typeof err === 'string' ? err : String(err));
      console.error("❌ SignalR connection error:", errorMsg);
      
      const isServiceUnavailable = 
        errorMsg.includes("404") || 
        errorMsg.includes("Container App is stopped") ||
        errorMsg.includes("does not exist") ||
        errorMsg.includes("cannot resolve host") ||
        errorMsg.includes("ECONNREFUSED");

      if (isServiceUnavailable) {
        console.warn(
          "⚠️ SignalR service unavailable (backend may be stopped or proxy not working). Will retry in 30s...",
          errorMsg.substring(0, 100),
        );
        // Retry after 30 seconds instead of 5
        setTimeout(() => this.start(), 30000);
      } else {
        console.error("❌ SignalR connection failed:", err);
        // Retry sooner for other errors
        setTimeout(() => this.start(), 5000);
      }
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
   * With automatic retry if connection is not ready
   */
  async sendMessage(roomId: number, content: string, retryCount: number = 0, maxRetries: number = 5): Promise<void> {
    const connectionState = this.chatConnection?.state;
    const stateLabel = connectionState !== undefined && connectionState !== null 
      ? signalR.HubConnectionState[connectionState] 
      : 'Unknown';
    console.log(`📊 Connection state: ${stateLabel}, Retry: ${retryCount}/${maxRetries}`);
    
    if (this.chatConnection?.state !== signalR.HubConnectionState.Connected) {
      if (retryCount < maxRetries) {
        const waitTime = 2000 + (retryCount * 500); // Increase wait time
        const currentStateLabel = this.chatConnection?.state !== undefined && this.chatConnection?.state !== null
          ? signalR.HubConnectionState[this.chatConnection?.state]
          : 'Unknown';
        console.warn(`⏳ Chat connection not ready (${currentStateLabel}), retrying SendMessage (${retryCount + 1}/${maxRetries}) in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.sendMessage(roomId, content, retryCount + 1, maxRetries);
      } else {
        const finalState = this.chatConnection?.state !== undefined && this.chatConnection?.state !== null
          ? signalR.HubConnectionState[this.chatConnection?.state]
          : 'Unknown';
        console.error(`❌ Chat connection not ready after ${maxRetries} retries. Final state: ${finalState}`);
        throw new Error(`Kết nối chat không sẵn sàng (${finalState}). Vui lòng kiểm tra kết nối và thử lại.`);
      }
    }

    try {
      console.log(`💬 Sending message to room ${roomId}`);
      await this.chatConnection.invoke("SendMessage", roomId, content);
      console.log("✅ Message sent via SignalR");
    } catch (err: unknown) {
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
