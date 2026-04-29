import { useEffect } from "react";
import { realtimeService, NotificationDto } from "@/services/realtimeService";
import { UserNotification } from "@/types/notification";

/**
 * Hook to set up real-time notification listeners
 * Handles system and community notifications separately
 */
export const useRealtimeNotifications = (
  setSystemNotifications: (updater: (prev: UserNotification[]) => UserNotification[]) => void,
  setCommunityNotifications: (updater: (prev: UserNotification[]) => UserNotification[]) => void
) => {
  useEffect(() => {
    const notifyConnection = realtimeService.getNotifyConnection();
    if (!notifyConnection) {
      console.warn("❌ Notify connection not available");
      return;
    }

    // Listener for system notifications
    const handleSystemNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationDto>;
      const notification = customEvent.detail;

      console.log("🔄 [useRealtimeNotifications] System notification received:", notification);

      // Convert NotificationDto to UserNotification and prepend
      setSystemNotifications((prev) => [
        {
          id: notification.notificationId,
          userId: parseInt(notification.userId),
          title: notification.title,
          content: notification.content,
          type: notification.type as any,
          objectId: notification.objectId ? parseInt(notification.objectId) : undefined,
          createdAt: notification.createdAt,
          isRead: notification.isRead,
          company: {
            id: 0,
            name: "",
            avatar: "",
            role: "",
          },
        },
        ...prev,
      ]);
    };

    // Listener for community notifications
    const handleCommunityNotification = (event: Event) => {
      const customEvent = event as CustomEvent<NotificationDto>;
      const notification = customEvent.detail;

      console.log("🔄 [useRealtimeNotifications] Community notification received:", notification);

      // Convert NotificationDto to UserNotification and prepend
      setCommunityNotifications((prev) => [
        {
          id: notification.notificationId,
          userId: parseInt(notification.userId),
          title: notification.title,
          content: notification.content,
          type: notification.type as any,
          objectId: notification.objectId ? parseInt(notification.objectId) : undefined,
          createdAt: notification.createdAt,
          isRead: notification.isRead,
          company: {
            id: 0,
            name: "",
            avatar: "",
            role: "",
          },
        },
        ...prev,
      ]);
    };

    // Register event listeners
    window.addEventListener("realtime-system-notification", handleSystemNotification);
    window.addEventListener("realtime-community-notification", handleCommunityNotification);

    // Cleanup
    return () => {
      window.removeEventListener("realtime-system-notification", handleSystemNotification);
      window.removeEventListener("realtime-community-notification", handleCommunityNotification);
    };
  }, [setSystemNotifications, setCommunityNotifications]);
};
