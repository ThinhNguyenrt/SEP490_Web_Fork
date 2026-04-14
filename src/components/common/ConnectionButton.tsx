import { useState, useEffect } from "react";
import { UserPlus, Check, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { connectionService } from "@/services/connection.api";
import { Connection, ConnectionStatus } from "@/types/connection";
import { useAppSelector } from "@/store/hook";

interface ConnectionButtonProps {
  targetUserId: number;
  targetUserRole: number; // 1 = talent, 2 = recruiter
  portfolioId?: number;
  onConnectionStatusChange?: (connection: Connection | null) => void;
}

/**
 * Helper to normalize connection status to uppercase enum value
 */
const normalizeStatus = (status: string | null | undefined): ConnectionStatus | null => {
  if (!status) return null;
  const upper = status.toUpperCase();
  if (Object.values(ConnectionStatus).includes(upper as ConnectionStatus)) {
    return upper as ConnectionStatus;
  }
  return null;
};

/**
 * ConnectionButton Component
 * Displays connection status and allows users to connect with others
 * Shows different states based on connection status (PENDING, ACCEPTED, REJECTED, or no connection)
 */
export default function ConnectionButton({
  targetUserId,
  targetUserRole,
  portfolioId = 0,
  onConnectionStatusChange,
}: ConnectionButtonProps) {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = user?.id;
  const currentUserRole = user?.role;

  // Check if connection exists on component mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!currentUserId || !accessToken) {
        console.log("⏭️ Skipping connection check: not logged in or no user ID");
        setChecking(false);
        return;
      }

      try {
        setChecking(true);
        console.log("🔍 Checking for existing connection...");
        
        // Check if connection exists from current user to target user
        const existingConnection =
          await connectionService.getConnectionBetweenUsers(
            currentUserId,
            targetUserId,
            accessToken
          );

        setConnection(existingConnection);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error checking connection";
        console.error("❌ Error checking connection:", errorMsg);
        // Don't show error for connection check, just continue without a connection
      } finally {
        setChecking(false);
      }
    };

    checkConnection();
  }, [currentUserId, targetUserId, accessToken]);

  // Handle creating new connection
  const handleConnect = async () => {
    if (!currentUserId || !accessToken) {
      notify.error("Vui lòng đăng nhập để kết nối");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("📤 Sending connection request...");
      const newConnection = await connectionService.createConnection(
        {
          userIdFrom: currentUserId,
          userIdTo: targetUserId,
          profileId: portfolioId,
        },
        accessToken
      );

      setConnection(newConnection);
      notify.success("Yêu cầu kết nối đã gửi");
      onConnectionStatusChange?.(newConnection);
    } catch (err) {
      const errorMsg = 
        err instanceof Error 
          ? err.message 
          : "Không thể gửi yêu cầu kết nối. Vui lòng thử lại.";
      setError(errorMsg);
      notify.error(errorMsg);
      console.error("❌ Connection error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting connection request (if we received the request)
  const handleAccept = async () => {
    if (!connection || !accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const updatedConnection = await connectionService.acceptConnection(
        connection.id,
        accessToken
      );

      setConnection(updatedConnection);
      notify.success("Yêu cầu kết nối đã được chấp nhận");
      onConnectionStatusChange?.(updatedConnection);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Không thể chấp nhận yêu cầu";
      setError(errorMsg);
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handle rejecting connection request
  const handleReject = async () => {
    if (!connection || !accessToken) return;

    try {
      setLoading(true);
      setError(null);

      const updatedConnection = await connectionService.rejectConnection(
        connection.id,
        accessToken
      );

      setConnection(updatedConnection);
      notify.success("Yêu cầu kết nối đã bị từ chối");
      onConnectionStatusChange?.(updatedConnection);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Không thể từ chối yêu cầu";
      setError(errorMsg);
      notify.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Don't render button if viewing own profile or checking
  if (currentUserId === targetUserId || checking) {
    return null;
  }

  // Don't show button if both are talents
  if (currentUserRole === 1 && targetUserRole === 1) {
    return null;
  }

  // Loading state - show spinner
  if (checking) {
    return (
      <Button disabled className="px-6 py-3 rounded-2xl">
        <Loader2 size={16} className="animate-spin" />
      </Button>
    );
  }

  // No connection exists - show connect button
  if (!connection) {
    return (
      <>
        <Button
          onClick={handleConnect}
          disabled={loading}
          className="flex-1 lg:flex-none px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin mr-2" />
              Đang gửi...
            </>
          ) : (
            <>
              <UserPlus size={16} className="mr-2" />
              Kết nối
            </>
          )}
        </Button>
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </>
    );
  }

  // Connection pending - show different UI based on who is sender/receiver
  // If current user is the sender (userIdFrom), only show status message
  // If current user is the receiver (userIdTo), show accept/reject buttons
  if (connection && normalizeStatus(connection.status as string) === ConnectionStatus.PENDING) {
    const isSender = connection.userIdFrom === currentUserId;

    if (isSender) {
      // Sender side: show only status message, no buttons
      return (
        <div className="flex items-center gap-2 px-6 py-3 bg-amber-50 border border-amber-300 rounded-2xl">
          <Loader2 size={16} className="animate-spin text-amber-600" />
          <span className="text-amber-700 font-black text-sm">Đã gửi yêu cầu kết nối</span>
        </div>
      );
    }

    // Receiver side: show accept/reject buttons
    return (
      <div className="flex gap-2">
        <Button
          onClick={handleAccept}
          disabled={loading}
          className="flex-1 lg:flex-none px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <Check size={16} className="mr-1" />
              Chấp nhận
            </>
          )}
        </Button>
        <Button
          onClick={handleReject}
          disabled={loading}
          variant="outline"
          className="flex-1 lg:flex-none px-4 py-3 border-2 border-red-300 text-red-600 rounded-2xl font-black text-sm hover:bg-red-50 transition-all cursor-pointer"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              <X size={16} className="mr-1" />
              Từ chối
            </>
          )}
        </Button>
      </div>
    );
  }

  // Connection matched - show connected status
  if (connection && normalizeStatus(connection.status as string) === ConnectionStatus.MATCHED) {
    return (
      <Button
        disabled
        className="flex-1 lg:flex-none px-6 py-3 bg-green-100 text-green-700 border border-green-300 rounded-2xl font-black text-sm cursor-not-allowed"
      >
        <Check size={16} className="mr-2" />
        Đã kết nối
      </Button>
    );
  }

  // Connection rejected - show rejected status
  if (connection && normalizeStatus(connection.status as string) === ConnectionStatus.REJECTED) {
    return (
      <Button
        disabled
        className="flex-1 lg:flex-none px-6 py-3 bg-red-100 text-red-700 border border-red-300 rounded-2xl font-black text-sm cursor-not-allowed"
      >
        <X size={16} className="mr-2" />
        Yêu cầu bị từ chối
      </Button>
    );
  }

  return null;
}
