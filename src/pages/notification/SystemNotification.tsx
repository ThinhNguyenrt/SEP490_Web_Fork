
import { useAppSelector } from "@/store/hook";
import { UserNotification } from "@/types/notification";
import { formatTimeAgo } from "@/utils/FormatTime";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSystemNotifications, markNotificationAsRead } from "@/services/notification.api";
import { useRealtimeNotifications } from "@/hook/useRealtimeNotifications";

const SystemNotification = () => {
  const [systemNotifications, setSystemNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { accessToken } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const observerTarget = useRef(null);

  // Setup real-time listeners for system notifications
  useRealtimeNotifications(setSystemNotifications, () => {});

  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    if (isRead) return;

    try {
      await markNotificationAsRead(id, accessToken ?? undefined);

      // Cập nhật UI local
      setSystemNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = (notif: UserNotification) => {
    handleMarkAsRead(notif.id, notif.isRead);

    // Navigate based on notification type
    let navigationPath = "";
    switch (notif.type) {
      case "CONNECTION_REQUEST_SENT":
      case "CONNECTION_ACCEPTED":
      case "CONNECTION_REJECTED":
        navigationPath = `/connection`;
        break;
      case "APPLICATION_APPROVED":
      case "APPLICATION_REJECTED":
        navigationPath = `/talent/application/${notif.objectId}`;
        break;
      case "JOB_INVITATION":
        navigationPath = `/talent/job/${notif.objectId}`;
        break;
      case "PORTFOLIO_APPROVED":
      case "PORTFOLIO_REPORTED":
        navigationPath = `/portfolio/${notif.objectId}`;
        break;
      case "POST_APPROVED":
      case "PROFILE_VIEWED":
        navigationPath = `/profile/${notif.actor?.id}`;
        break;
      default:
        navigationPath = `/notification`;
    }

    if (navigationPath) {
      navigate(navigationPath);
    }
  };

  const fetchNotifs = useCallback(
    async (cursor?: string | null) => {
      if (loading) return;

      setLoading(true);
      try {
        const data = await fetchSystemNotifications(cursor, 10, accessToken ?? undefined);

        // Append new items if cursor exists, otherwise replace
        setSystemNotifications((prev) => (cursor ? [...prev, ...data.items] : data.items));
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore && !!data.nextCursor);
        console.log("System notifications loaded:", data.items);
      } catch (error) {
        console.error("Error fetching system notifications:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  // Initial fetch
  useEffect(() => {
    if (accessToken) {
      fetchNotifs();
    }
  }, [accessToken]);

  // Infinite scroll observer
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      fetchNotifs(nextCursor);
    }
  }, [hasMore, loading, nextCursor, fetchNotifs]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [handleLoadMore]);

  if (loading && systemNotifications.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!loading && systemNotifications.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400 text-sm">Không có thông báo nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="space-y-3">
        {systemNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleNotificationClick(notif)}
            className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 transition-all cursor-pointer group ${
              notif.isRead
                ? "border-gray-100 opacity-80"
                : "border-blue-100 bg-blue-50/10 shadow-blue-50"
            } hover:border-blue-400/50 hover:shadow-md`}
          >
            {/* Avatar / Icon Section */}
            <div className="relative inline-block shrink-0">
              <img
                alt={notif.actor?.name || notif.company?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                src={
                  notif.actor?.avatar ||
                  notif.company?.avatar ||
                  "/user_placeholder.png"
                }
              />
              {(notif.actor?.Role === "COMPANY" ||
                notif.company?.role === "COMPANY") && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-10">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-5 h-5 bg-white rounded-full border-2 border-white"
                  />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-grow">
              <p className="text-gray-900 text-sm font-semibold leading-snug">
                {notif.title}
              </p>
              <p className="text-gray-600 text-sm leading-snug mt-1">
                {notif.content}
              </p>
              <span className="text-xs text-gray-500 mt-2 block">
                {formatTimeAgo(notif.createdAt)}
              </span>
            </div>

            {!notif.isRead && (
              <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shrink-0"></span>
            )}
          </div>
        ))}
      </div>

      {/* Loading & Load More Section */}
      <div className="py-4 flex justify-center">
        <div ref={observerTarget} className="h-1" />

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-gray-500 w-full">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Đang tải thông báo...</p>
          </div>
        ) : (
          !hasMore &&
          systemNotifications.length > 0 && (
            <p className="text-center text-gray-400 py-4 text-xs">
              Bạn đã xem hết tất cả thông báo.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default SystemNotification;
