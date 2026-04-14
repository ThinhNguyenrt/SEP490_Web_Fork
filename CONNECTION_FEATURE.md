# Connection Feature Documentation

## Overview
The connection feature allows talent (ứng viên) and recruiters (nhà tuyển dụng) to connect with each other. When viewing another user's profile, users can send connection requests that need to be accepted or rejected.

## Implementation Details

### 1. Connection Types (`src/types/connection.ts`)
- **ConnectionStatus**: Enum with three values: `PENDING`, `ACCEPTED`, `REJECTED`
- **Connection**: Main connection object with:
  - `id`: Unique connection ID
  - `userIdFrom`: ID of user sending the request
  - `userIdTo`: ID of user receiving the request
  - `profileId`: Portfolio ID (as specified in requirements)
  - `status`: Connection status
  - `createdAt`, `updatedAt`: Timestamps
  - `rooms`: Array of chat rooms (for future messaging feature)

### 2. Connection Service (`src/services/connection.api.ts`)
Provides the following methods:

#### `createConnection(request, accessToken)`
- Creates a new connection request
- Request body:
  ```json
  {
    "userIdFrom": <currentUserId>,
    "userIdTo": <targetUserId>,
    "profileId": <portfolioId>
  }
  ```

#### `getConnections(accessToken)`
- Fetches all connections for the current user

#### `getConnectionBetweenUsers(userIdFrom, userIdTo, accessToken)`
- Checks if a connection exists between two specific users
- Returns `null` if no connection found

#### `updateConnectionStatus(connectionId, status, accessToken)`
- Updates connection status to `ACCEPTED` or `REJECTED`
- Cannot set status to `PENDING`

#### `acceptConnection(connectionId, accessToken)`
- Shortcut method to accept a connection request

#### `rejectConnection(connectionId, accessToken)`
- Shortcut method to reject a connection request

### 3. ConnectionButton Component (`src/components/common/ConnectionButton.tsx`)
Smart component that displays different UI based on connection state:

#### States:
1. **No connection yet**: Shows blue "Kết nối" button
   - Clicking sends connection request with current user as `userIdFrom`
   - Button shows loading state while sending

2. **PENDING (We sent the request)**:
   - Shows disabled button "Chờ xác nhận..." (Waiting for confirmation)
   - User cannot take action, waiting for recipient to respond

3. **PENDING (We received the request)**:
   - Shows two buttons: "Chấp nhận" (green) and "Từ chối" (red)
   - Recipient can accept or reject the connection

4. **ACCEPTED**: 
   - Shows disabled green button "Đã kết nối" (Connected)
   - Indicates successful connection

5. **REJECTED**:
   - Shows disabled red button "Yêu cầu bị từ chối" (Request rejected)
   - Indicates connection was declined

#### Props:
- `targetUserId` (required): ID of the user to connect with
- `portfolioId` (optional, default=0): Portfolio ID to include in connection request
- `onConnectionStatusChange` (optional): Callback when connection status changes

### 4. Integration Points

#### OtherTalentProfile (`src/pages/profile/otherProfile/OtherTalentProfile.tsx`)
Added ConnectionButton next to the message button:
```tsx
<ConnectionButton 
  targetUserId={parseInt(userId || "0", 10)} 
/>
```

#### OtherCompanyProfile (`src/pages/profile/otherProfile/OtherCompanyProfile.tsx`)
Added ConnectionButton next to the message button:
```tsx
<ConnectionButton 
  targetUserId={parseInt(userId || "0", 10)} 
/>
```

## API Configuration

### Environment Variables
Add to `.env` file:
```
VITE_CONNECTION_API_BASE_URL=https://connection-service.grayforest-11aba44e.southeastasia.azurecontainerapps.io/api
```

The service automatically:
- Uses the environment variable if provided
- Falls back to the default production URL if not set
- Supports localhost with relative paths (for future proxy configuration)

## Connection Flow

### Scenario 1: Talent sends connection request to Recruiter
1. Talent visits recruiter's profile (OtherCompanyProfile)
2. Talent clicks "Kết nối" button
3. ConnectionButton sends request:
   - `userIdFrom`: Talent's ID
   - `userIdTo`: Recruiter's ID
   - `profileId`: 0 (or portfolio ID if available)
4. Button updates to "Chờ xác nhận..." state
5. Recruiter views talent's profile
6. ConnectionButton shows "Chấp nhận" and "Từ chối" buttons
7. Recruiter clicks "Chấp nhận"
8. Both users now see "Đã kết nối" state

### Scenario 2: Connection already exists
- If users already have a connection (in either direction), the component:
  - Detects it on mount
  - Shows appropriate status button
  - Prevents duplicate connection requests

## Key Features

✅ **Bidirectional checking**: Checks connections in both directions (A→B and B→A)
✅ **Real-time status display**: Shows accurate status based on who sent the request
✅ **Error handling**: Provides user-friendly error messages
✅ **Loading states**: Visual feedback during API calls
✅ **Self-profile protection**: Doesn't show button when viewing own profile
✅ **Auth-aware**: Only available to logged-in users
✅ **Toast notifications**: Success and error messages via `notify` library

## Response from Connection Service
When a connection is created or updated, the API returns:
```json
{
  "id": 6,
  "userIdFrom": 4,
  "userIdTo": 7,
  "profileId": 34,
  "status": "PENDING",
  "createdAt": "2026-04-14T00:39:15.575946Z",
  "createAt": "2026-04-14T07:39:15.5775304",
  "connectionAt": null,
  "rooms": [],
  "updatedAt": null
}
```

## Future Enhancements

1. **View all connections**: Dashboard showing all pending/accepted connections
2. **Connection notifications**: Real-time notifications when connection requests arrive
3. **Direct messaging**: Use `rooms` array to initiate chat
4. **Connection removal**: Allow users to disconnect
5. **Connection history**: Track when connections were established
