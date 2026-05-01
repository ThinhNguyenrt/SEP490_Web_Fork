# Chat Connection Troubleshooting Guide

## 📋 Quick Summary of the Issue
The error "Chat connection not ready - unable to send message" appears because the SignalR WebSocket connection to your backend's `/hubs/chat` endpoint is failing to establish.

---

## 🔍 Step 1: Check Connection Status (Browser Console)

1. **Open DevTools**: Press `F12` in your browser
2. **Go to Console tab**
3. **Look for these key logs** when you visit the Chat page:

### What to Look For:

✅ **Good Signs:**
```
📡 [RealtimeService] Initializing connections in DEV mode
📡 Chat Hub URL: /hubs/chat
📡 Starting chat connection...
🚀 SignalR Connected (Chat + Notify)
✅ Joined chat room: [roomId]
```

❌ **Bad Signs (Connection Failed):**
```
❌ SignalR connection failed: [error message]
⚠️ SignalR service unavailable (backend may be stopped or proxy not working)
📊 Connection state: Connecting, Retry: 5/5
```

---

## 🔧 Step 2: Check Vite Proxy Configuration

Your `vite.config.ts` has a proxy for `/hubs`:

```typescript
"/hubs": {
  target: "https://api-gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io",
  changeOrigin: true,
  ws: true,  // ← Must be true for WebSocket
  rewrite: (path) => path,
  logLevel: "info",
}
```

**Common Issues:**
- ❌ `ws: true` is missing → WebSocket won't work
- ❌ Target URL is wrong → Connection fails
- ❌ `changeOrigin: true` is missing → CORS issues

---

## 🌐 Step 3: Check Network Tab

1. **In DevTools**, go to **Network** tab
2. **Filter for WS** (WebSocket)
3. **Try to send a message**
4. **Look for connection request** to `/hubs/chat`

### Expected WebSocket Connection:
```
Request URL: ws://localhost:5173/hubs/chat
Status: 101 Switching Protocols ✅
```

### If You See:
- **404 Not Found**: Backend service doesn't have this endpoint
- **Connection Refused**: Backend is down or wrong URL
- **Timeout**: Network/firewall issue

---

## 🚀 Step 4: Restart Dev Server

The Vite dev server caches configuration. After any change:

```bash
# Stop the dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Step 5: Test Backend Connectivity

Check if your backend API Gateway is running:

```bash
# Test if backend is reachable
curl -v https://api-gateway.redmushroom-1d023c6a.southeastasia.azurecontainerapps.io/hubs/chat

# Expected: Should upgrade to WebSocket protocol (Status 101)
# Not: 404, Connection Refused, or Timeout
```

---

## 📊 Step 6: Check Connection Status Indicator

After my fixes, ChatDetails should show:

✅ **Connected**: Input field enabled, green indicator
❌ **Not Connected**: Input field disabled, yellow warning with state

### What Each State Means:
- **Connected**: Ready to send messages
- **Connecting**: Still trying to establish connection
- **Disconnected**: Not connected, retrying
- **Reconnecting**: Lost connection, attempting to restore

---

## 🛠️ Common Fixes

### Issue 1: Backend Container is Stopped
**Solution:**
- Contact DevOps to restart the API Gateway container
- Check if Azure Container Apps are running

### Issue 2: Token Expired
**Solution:**
- Log out and log back in
- Make sure access token is valid

### Issue 3: Wrong Backend URL
**Solution:**
- Check `vite.config.ts` target URL
- Verify against actual backend deployment URL
- Update if backend was redeployed

### Issue 4: Proxy Not Working in Development
**Solution:**
- Check `logLevel: "info"` output in terminal
- Look for proxy errors in dev server logs
- Consider using full URL directly (less ideal)

---

## 📝 What the Fixes Do

1. **Better Error Messages**: Shows connection state (Connecting, Disconnected, etc.)
2. **Connection Status Indicator**: Visual feedback in UI
3. **Input Protection**: Can't send until connection is ready
4. **Increased Retries**: 5 attempts instead of 3
5. **Proxy Logging**: Debug information for troubleshooting

---

## 🎯 Expected Behavior After Fix

1. Navigate to Chat → "Đang kết nối..." message appears briefly
2. Within 2-5 seconds → Connection established
3. Input field enables automatically
4. You can now send messages normally

If this doesn't happen:
- Check console logs (Step 1)
- Check Network tab (Step 3)
- Restart dev server (Step 4)
- Test backend (Step 5)

---

## 📞 If Still Not Working

Collect this info and report:
1. **Console logs** - Copy the error messages
2. **Network requests** - Check WebSocket request details
3. **Backend status** - Is API Gateway running?
4. **Recent changes** - What changed before error started?
5. **Backend logs** - Ask backend team to check `/hubs/chat` endpoint logs
