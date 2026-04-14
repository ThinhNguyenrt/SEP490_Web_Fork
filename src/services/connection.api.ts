/**
 * Connection API Service
 * Handles connection requests between talent and recruiter users
 */
import {
  Connection,
  CreateConnectionRequest,
  UpdateConnectionRequest,
  ConnectionStatus,
} from "@/types/connection";

// Connection service API base URL
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_CONNECTION_API_BASE_URL;

  // If environment variable is set, use it
  if (envUrl && envUrl.trim() !== "") {
    console.log("✅ Using env var VITE_CONNECTION_API_BASE_URL:", envUrl);
    return envUrl;
  }

  // Default to production connection service URL
  const fallbackUrl =
    "https://connection-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api";
  console.log("🌐 Using default connection service URL:", fallbackUrl);
  return fallbackUrl;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Create a connection request between two users
 * @param request - CreateConnectionRequest with userIdFrom, userIdTo, profileId
 * @param accessToken - User's access token
 * @returns Created connection object
 */
export const createConnection = async (
  request: CreateConnectionRequest,
  accessToken: string
): Promise<Connection> => {
  try {
    console.log("📤 Creating connection with request:", request);
    const url = `${API_BASE_URL}/Connection`;
    console.log("🌐 Request URL:", url);
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    console.log("📊 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      
      // Try to parse as JSON if possible
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || errorJson.error || `Failed to create connection: ${response.status}`);
      } catch {
        throw new Error(`Failed to create connection: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    console.log("✅ Connection created:", data);
    return data;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to create connection";
    console.error("❌ Error creating connection:", errorMsg);
    throw error;
  }
};

/**
 * Get all connections for the current user
 * @param accessToken - User's access token
 * @returns List of connections
 */
export const getConnections = async (
  accessToken: string
): Promise<Connection[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Connection`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch connections: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ Connections fetched:", data);
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch connections";
    console.error("❌ Error fetching connections:", errorMsg);
    throw error;
  }
};

/**
 * Get connection between two specific users
 * Fetches all connections and filters for the one between these two users
 * @param userIdFrom - ID of user sending the request
 * @param userIdTo - ID of user receiving the request
 * @param accessToken - User's access token
 * @returns Connection object if exists, null otherwise
 */
export const getConnectionBetweenUsers = async (
  userIdFrom: number,
  userIdTo: number,
  accessToken: string
): Promise<Connection | null> => {
  try {
    console.log(
      `🔍 Checking connection between user ${userIdFrom} and ${userIdTo}`
    );
    
    const allConnections = await getConnections(accessToken);

    // Find connection where userIdFrom and userIdTo match (in either direction)
    const connection = allConnections.find(
      (conn) =>
        (conn.userIdFrom === userIdFrom && conn.userIdTo === userIdTo) ||
        (conn.userIdFrom === userIdTo && conn.userIdTo === userIdFrom)
    );

    if (connection) {
      console.log("✅ Connection found:", connection);
      return connection;
    }

    console.log("ℹ️ No connection found between these users");
    return null;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch connection";
    console.error("❌ Error fetching connection:", errorMsg);
    // Return null instead of throwing, as this is expected when no connection exists
    return null;
  }
};

/**
 * Accept or reject a connection request
 * @param connectionId - ID of the connection to update
 * @param status - New status (MATCHED or REJECTED)
 * @param accessToken - User's access token
 * @returns Updated connection object
 */
export const updateConnectionStatus = async (
  connectionId: number,
  status: ConnectionStatus,
  accessToken: string
): Promise<Connection> => {
  try {
    if (status === ConnectionStatus.PENDING) {
      throw new Error("Cannot set connection status to PENDING");
    }

    console.log(`📝 Updating connection ${connectionId} status to ${status}`);

    // API expects status as lowercase string: "matched" or "rejected"
    const statusValue = status.toLowerCase();
    const request: UpdateConnectionRequest = { status: statusValue };

    console.log("📤 Sending request:", { connectionId, body: request });

    const response = await fetch(
      `${API_BASE_URL}/Connection/${connectionId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(request),
      }
    );

    console.log("📊 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(
        `Failed to update connection: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Connection updated:", data);
    return data;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to update connection";
    console.error("❌ Error updating connection:", errorMsg);
    throw error;
  }
};

/**
 * Reject a connection request
 * @param connectionId - ID of the connection to reject
 * @param accessToken - User's access token
 * @returns Updated connection object
 */
export const rejectConnection = async (
  connectionId: number,
  accessToken: string
): Promise<Connection> => {
  return updateConnectionStatus(
    connectionId,
    ConnectionStatus.REJECTED,
    accessToken
  );
};

/**
 * Accept a connection request (sets status to MATCHED)
 * @param connectionId - ID of the connection to accept
 * @param accessToken - User's access token
 * @returns Updated connection object
 */
export const acceptConnection = async (
  connectionId: number,
  accessToken: string
): Promise<Connection> => {
  return updateConnectionStatus(
    connectionId,
    ConnectionStatus.MATCHED,
    accessToken
  );
};

/**
 * Room Summary Interface
 */
export interface RoomSummary {
  roomId: number;
  name: string;
  avatar: string;
  coverImage: string;
  role: string;
  lastContent: string | null;
  lastAt: string | null;
  unreadCount: number;
}

/**
 * Message Interface for API responses when sending messages
 */
export interface ApiMessage {
  id: number;
  userId: number;
  messageRoomId: number;
  content: string;
  createdAt: string;
  status: number;
  room?: {
    connectionId: number;
    createdAt: string;
    lastMessAt: string;
    connection: any;
    messages: any[];
    id: number;
    updatedAt: string | null;
  };
  updatedAt: string | null;
}

/**
 * Message Interface for API responses when fetching messages
 */
export interface ApiMessageResponse {
  id: number;
  messageRoomId: number;
  userId: number;
  content: string;
  createdAt: string;
  status: string; // "UNREAD" or other status values
}

/**
 * Request to send a message
 */
export interface SendMessageRequest {
  content: string;
}

/**
 * Get room summaries for a user
 * Shows all matched connections with room information
 * @param userId - User ID to get rooms for
 * @param accessToken - User's access token
 * @returns Array of room summaries
 */
export const getRoomSummaries = async (
  userId: number,
  accessToken: string
): Promise<RoomSummary[]> => {
  try {
    console.log(`📡 Fetching room summaries for user ${userId}`);
    const url = `${API_BASE_URL}/Connection/rooms/summary/${userId}`;
    console.log("🌐 Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("📊 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(
        `Failed to fetch room summaries: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Room summaries fetched:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch room summaries";
    console.error("❌ Error fetching room summaries:", errorMsg);
    throw error;
  }
};

/**
 * Get messages from a room
 * Fetches the latest messages from a specific message room
 * @param roomId - ID of the message room
 * @param accessToken - User's access token
 * @param limit - Optional maximum number of messages to fetch (default: no limit)
 * @returns Array of messages from the room
 */
export const getMessages = async (
  roomId: number,
  accessToken: string,
  limit?: number
): Promise<ApiMessageResponse[]> => {
  try {
    console.log(`📡 Fetching messages for room ${roomId}${limit ? ` (limit: ${limit})` : ""}`);
    
    // Build URL with optional limit parameter
    let url = `${API_BASE_URL}/Connection/rooms/${roomId}/messages/latest`;
    if (limit) {
      url += `?limit=${limit}`;
    }
    console.log("🌐 Request URL:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log("📊 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(
        `Failed to fetch messages: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Messages fetched:", data);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to fetch messages";
    console.error("❌ Error fetching messages:", errorMsg);
    throw error;
  }
};

/**
 * Send a message to a room
 * @param roomId - ID of the message room
 * @param content - Message content
 * @param accessToken - User's access token
 * @returns Created message object
 */
export const sendMessage = async (
  roomId: number,
  content: string,
  accessToken: string
): Promise<ApiMessage> => {
  try {
    console.log(`💬 Sending message to room ${roomId}`);
    const url = `${API_BASE_URL}/Connection/rooms/${roomId}/messages`;
    console.log("🌐 Request URL:", url);

    const request: SendMessageRequest = { content };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(request),
    });

    console.log("📊 Response Status:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ API error response:", errorText);
      throw new Error(
        `Failed to send message: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("✅ Message sent:", data);
    return data;
  } catch (error) {
    const errorMsg =
      error instanceof Error ? error.message : "Failed to send message";
    console.error("❌ Error sending message:", errorMsg);
    throw error;
  }
};

export const connectionService = {
  createConnection,
  getConnections,
  getConnectionBetweenUsers,
  updateConnectionStatus,
  acceptConnection,
  rejectConnection,
  getRoomSummaries,
  getMessages,
  sendMessage,
};
