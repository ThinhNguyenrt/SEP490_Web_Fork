
import { useAppSelector } from "@/store/hook";
import { UserNotification } from "@/types/notification";
import { formatTimeAgo } from "@/utils/FormatTime";
import { MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { fetchSystemNotifications } from "@/services/notification.api";
import { useRealtimeNotifications } from "@/hook/useRealtimeNotifications";

const SystemNotification = () => {
  const [systemNotifications, setSystemNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const { accessToken } = useAppSelector((state) => state.auth);
  const observerTarget = useRef(null);

  // Setup real-time listeners for system notifications
  useRealtimeNotifications(setSystemNotifications, () => {});

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
    [accessToken, loading]
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
    <div className="space-y-4">
      {systemNotifications.map((notif) => (
        <div
          key={notif.id}
          className="bg-white p-6 rounded-xl shadow-sm border border-blue-50 max-w-2xl transform transition-hover hover:scale-[1.01]"
        >
          <p className="text-gray-700 text-center mb-6 leading-relaxed">
            {notif.content || notif.title}
          </p>
          <div className="flex flex-col items-center gap-4">
            {/* Avatar / Icon Section */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                <img
                  alt={notif.actor?.name || notif.company?.name}
                  className="w-12 h-12 object-cover rounded-full"
                  src={
                    notif.actor?.avatar ||
                    notif.company?.avatar ||
                    "/user_placeholder.png"
                  }
                />
                {/* Company badge */}
                {(notif.actor?.Role === "COMPANY" ||
                  notif.company?.role === "COMPANY") && (
                  <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                    <img
                      src="/blue-tick-company.png"
                      alt="Verified"
                      className="w-5 h-5 bg-white rounded-full border-2 border-white"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Name / Company Name */}
            <h3 className="text-xl font-bold text-gray-900">
              {notif.actor?.name || notif.company?.name}
            </h3>

            {/* Time */}
            <span className="text-xs text-gray-500">
              {formatTimeAgo(notif.createdAt)}
            </span>

            {/* Action Button */}
            <button className="mt-2 px-8 py-2.5 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors cursor-pointer flex items-center gap-2">
              <MessageSquare size={18} />
              Bắt đầu trò chuyện
            </button>
          </div>
        </div>
      ))}

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
