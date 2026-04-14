// Connection statuses
export enum ConnectionStatus {
  PENDING = "PENDING",
  MATCHED = "MATCHED",
  REJECTED = "REJECTED",
}

// Request body for creating a connection
export interface CreateConnectionRequest {
  userIdFrom: number;
  userIdTo: number;
  profileId: number; // portfolioId
}

// Response from connection service
export interface Connection {
  id: number;
  userIdFrom: number;
  userIdTo: number;
  profileId: number; // portfolioId
  status: ConnectionStatus | string; // API may return uppercase string
  createAt: string;
  connectionAt: string | null;
  rooms: string[];
  createdAt: string;
  updatedAt: string | null;
}

// Request to accept/reject connection
// API expects status as string: "matched" or "rejected"
export interface UpdateConnectionRequest {
  status: string; // Sent as lowercase to API: "matched" | "rejected"
}

// List connections response
export interface ConnectionsResponse {
  data: Connection[];
  total: number;
}
