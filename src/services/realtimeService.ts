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
class RealtimeService {
  private connection: signalR.HubConnection | null = null;
  private watchingPostIds = new Set<string>();

  // Khởi tạo kết nối
  public initConnection(accessToken: string) {
    if (this.connection) return;

    const BASE_GATEWAY_URL =
      "https://api-gateway.grayforest-11aba44e.southeastasia.azurecontainerapps.io";

    // Đảm bảo không có "/api" ở giữa nếu Backend cấu hình Hub nằm ngoài Route API
    const hubUrl = `${BASE_GATEWAY_URL}/hubs/realtime`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.connection) return;

    this.connection.on("ReceiveComment", (event) => {
      window.dispatchEvent(
        new CustomEvent("realtime-comment", { detail: event }),
      );
    });

    this.connection.on("ReceiveReply", (event) => {
      window.dispatchEvent(
        new CustomEvent("realtime-reply", { detail: event }),
      );
    });
    this.connection.on("ReceivePostFavoriteChanged", (data) => {
      window.dispatchEvent(
        new CustomEvent("realtime-favorite", { detail: data }),
      );
    });
    this.connection.on("ReceiveNotification", (event: NotificationEvent) => {
      console.log("🔔 New notification:", event);
      // 1. Bắn CustomEvent để các component lắng nghe và cập nhật list
      window.dispatchEvent(
        new CustomEvent("realtime-notification", { detail: event }),
      );
    });
  }

  async start() {
    if (this.connection?.state === signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start();
        console.log("🚀 SignalR Connected");
      } catch (err) {
        setTimeout(() => this.start(), 5000);
      }
    }
  }

  // services/realtimeService.ts
  async joinPost(postId: string) {
    // Đợi cho đến khi kết nối thực sự sẵn sàng
    if (this.connection?.state !== signalR.HubConnectionState.Connected) {
      console.warn("⏳ Đang đợi kết nối để JoinPost...");
      // Có thể đợi một chút rồi thử lại
      setTimeout(() => this.joinPost(postId), 10000);
      return;
    }

    try {
      await this.connection.invoke("JoinPost", postId);
      console.log(`✅ Đã Join thành công Group: post_${postId}`);
    } catch (err) {
      console.error("❌ JoinPost failed:", err);
    }
  }

  async leavePost(postId: number | string) {
    const id = String(postId);
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke("LeavePost", id);
      this.watchingPostIds.delete(id);
    }
  }

  stop() {
    this.connection?.stop();
    this.connection = null;
  }
}

export const realtimeService = new RealtimeService();
