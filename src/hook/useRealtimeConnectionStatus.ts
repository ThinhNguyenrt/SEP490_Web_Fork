import { useState, useEffect } from "react";
import { realtimeService } from "@/services/realtimeService";
import * as signalR from "@microsoft/signalr";

interface ConnectionStatus {
  chatReady: boolean;
  notifyReady: boolean;
  allReady: boolean;
  chatState: string;
  notifyState: string;
}

export function useRealtimeConnectionStatus(): ConnectionStatus {
  const [status, setStatus] = useState<ConnectionStatus>({
    chatReady: false,
    notifyReady: false,
    allReady: false,
    chatState: "Not initialized",
    notifyState: "Not initialized",
  });

  useEffect(() => {
    const updateStatus = () => {
      const connStatus = realtimeService.getConnectionStatus();
      setStatus({
        chatReady: connStatus.chat.isConnected,
        notifyReady: connStatus.notify.isConnected,
        allReady: connStatus.chat.isConnected && connStatus.notify.isConnected,
        chatState: connStatus.chat.stateLabel,
        notifyState: connStatus.notify.stateLabel,
      });
    };

    // Initial check
    updateStatus();

    // Listen for connection ready event
    const handleConnectionReady = () => {
      updateStatus();
    };

    window.addEventListener("realtime-connection-ready", handleConnectionReady);

    // Poll every 2 seconds
    const interval = setInterval(updateStatus, 2000);

    return () => {
      window.removeEventListener("realtime-connection-ready", handleConnectionReady);
      clearInterval(interval);
    };
  }, []);

  return status;
}
