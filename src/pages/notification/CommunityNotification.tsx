import { useAppSelector } from "@/store/hook";
import { UserNotification } from "@/types/notification";
import { formatTimeAgo } from "@/utils/FormatTime";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CommunityNotification = () => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await fetch(
        "https://notification-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/notifications/unread-count",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      const data = await response.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Lỗi fetch unread count:", error);
    }
  }, [accessToken]);
  const fetchNotifications = useCallback(
    async (cursor?: number) => {
      if (loading) return;

      setLoading(true);
      try {
        const url = new URL(
          "https://notification-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/notifications",
          window.location.origin,
        );
        url.searchParams.append("limit", "5");
        if (cursor) {
          url.searchParams.append("cursor", cursor.toString());
        }

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        // Giả sử API trả về cấu hình: { items: [...], nextCursor: number | null }
        const newItems = data.items || [];

        setNotifications((prev) =>
          cursor ? [...prev, ...newItems] : newItems,
        );
        setNextCursor(data.nextCursor);
        setHasMore(!!data.nextCursor); // Nếu nextCursor null/undefined thì hết data
        console.log("data: ", data.items);
      } catch (error) {
        console.error("Lỗi khi fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken, loading],
  );
  const handleMarkAsRead = async (id: number, isRead: boolean) => {
    if (isRead) return;

    try {
      const response = await fetch(
        `https://notification-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/notifications/${id}/read`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.ok) {
        // Cập nhật UI local
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu đã đọc:", error);
    }
  };
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      const response = await fetch(
        "https://notification-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api/notifications/read-all",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.ok) {
        // Cập nhật UI local
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Lỗi khi đánh dấu tất cả đã đọc:", error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [accessToken]);
  const observerTarget = useRef(null);

  // Dùng useCallback để hàm không bị khởi tạo lại vô ích
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading && nextCursor) {
      fetchNotifications(nextCursor);
    }
  }, [hasMore, loading, nextCursor, fetchNotifications]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // Tải trước khi người dùng cuộn tới hẳn đáy 100px
      },
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
  return (
    <div className="max-w-2xl mx-auto space-y-3">
      <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-xl border border-blue-100 sticky top-52 z-50 shadow-md">
        <p className="text-sm text-blue-700 font-medium">
          Bạn có{" "}
          <span className="font-bold text-sm text-red-700">
            {" "}
            {unreadCount}{" "}
          </span>{" "}
          thông báo chưa đọc
        </p>
        <button
          onClick={handleMarkAllAsRead}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all cursor-pointer shadow-sm active:scale-95"
        >
          Đánh dấu đọc tất cả
        </button>
      </div>
      <div className="space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() =>
              handleMarkAsRead(notif.id, notif.isRead).then(() =>
                navigate(`/community/${notif.objectId}`),
              )
            }
            className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 transition-all cursor-pointer group ${
              notif.isRead
                ? "border-gray-100 opacity-80"
                : "border-blue-100 bg-blue-50/10 shadow-blue-50"
            } hover:border-blue-400/50 hover:shadow-md`}
          >
            {/* Avatar / Icon Section */}
            {/* {notif.type === "group" ? (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                <Users size={24} />
              </div>
            ) : ( */}
            <div className="relative inline-block shrink-0">
              <img
                alt={notif.actor?.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                src={notif.actor?.avatar || "/user_placeholder.png"}
              />
              {notif.actor?.Role === "COMPANY" && (
                <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4 z-10">
                  <img
                    src="/blue-tick-company.png"
                    alt="Verified"
                    className="w-5 h-5 bg-white rounded-full border-2 border-white"
                  />
                </div>
              )}
            </div>
            {/* )} */}

            {/* Content Section */}
            <div className="flex-grow">
              <p className="text-gray-700 text-sm leading-snug">
                {/* {notif.actor?.name && (
                  <span className="font-bold text-gray-900 mr-1">
                    {notif.actor.name}
                  </span>
                )} */}
                <span className="font-bold text-gray-900 mr-1">
                  {notif.content}
                </span>
              </p>
              <span className="text-xs text-gray-500 mt-1 block">
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
      {/* <div className="py-4 flex justify-center">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p>Đang tải thông báo...</p>
          </div>
        ) : (
          hasMore && (
            <button
              onClick={() => nextCursor && fetchNotifications(nextCursor)}
              className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-300 transition-all"
            >
              Xem thêm thông báo
            </button>
          )
        )}
      </div> */}
      <div className="py-4 flex justify-center">
        {/* Thẻ div này đóng vai trò điểm neo */}
        <div ref={observerTarget} className="h-1" />

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-gray-500 w-full">
            <Loader2 className="h-8 w-8 animate-spin mb-2" />
            <p className="text-sm">Đang tải thông báo...</p>
          </div>
        ) : (
          !hasMore &&
          notifications.length > 0 && (
            <p className="text-center text-gray-400 py-4 text-xs">
              Bạn đã xem hết tất cả thông báo.
            </p>
          )
        )}
      </div>

      {!loading && notifications.length === 0 && (
        <p className="text-center text-gray-400 py-10">
          Không có thông báo nào.
        </p>
      )}
    </div>
  );
};

export default CommunityNotification;
