# 📸 Portfolio Image Upload - Complete Guide

## Architecture Overview

### Frontend File Storage
- **Module-level Map**: `portfolioImageFiles` stores File objects during editing
- **Reference ID Format**: `image_${timestamp}_${random}` (e.g., `image_1712224329000_abc123`)
- **Session Persistence**: Files are kept in memory until app reload (not cleared after save)

### Frontend Flow

```
┌──────────────────────────────────────────────────────────┐
│                   EDITOR COMPONENT                        │
│  (IntroOneEditor, IntroFiveEditor, ProjectOneEditor)    │
└──────────────────────────────────────────────────────────┘
                          ↓
      User selects image file (JPG/PNG)
                          ↓
    Call uploadPortfolioImage(file, token)
                          ↓
┌──────────────────────────────────────────────────────────┐
│            PORTFOLIO.API.TS - uploadPortfolioImage        │
│  - Generate reference ID: "image_xxx_yyy"               │
│  - Store File in Map: portfolioImageFiles.set(id, file) │
│  - Mark status: fileUploadStatus.set(id, 'pending')     │
│  - Return reference ID                                  │
└──────────────────────────────────────────────────────────┘
                          ↓
    Store reference ID in draft.avatar
    Store File in local state for preview
                          ↓
    Create blob URL: URL.createObjectURL(file)
                          ↓
┌──────────────────────────────────────────────────────────┐
│           COMPONENT JSX - Preview                        │
│  <img src={avatarPreviewUrl} /> ← Shows preview!        │
└──────────────────────────────────────────────────────────┘
                          ↓
    User clicks "Save"
                          ↓
┌──────────────────────────────────────────────────────────┐
│         CreatePortfolio.tsx - handleSave                 │
│  1. Collect all reference IDs from blocks               │
│  2. Get File objects: portfolioService.getPortfolioImageFiles()
│  3. Create FormData:                                     │
│     - portfolioJson: JSON string with blocks            │
│     - files: [File1, File2, File3...]                   │
│  4. POST /api/portfolio with FormData                   │
└──────────────────────────────────────────────────────────┘
                          ↓
```

### Backend Responsibilities

The backend receives:
```
FormData {
  portfolioJson: {
    employeeId: 11,
    name: "Hồ sơ mới",
    blocks: [
      {
        type: "INTRO",
        variant: "INTROFIVE",
        data: { avatar: "image_1712224329000_abc123", ... }
      },
      ...
    ]
  },
  files: [File, File, ...]  // from multipart upload
}
```

Backend should:
1. **Parse portfolioJson** to get block data with reference IDs
2. **Process each File** from multipart upload
3. **Match Files to Reference IDs** in block data
4. **Save Files to Storage** (S3, local disk, etc.)
5. **Generate URLs** for each file
6. **Return Response** with either:
   - **Option A**: Replace reference IDs with actual URLs in response
   - **Option B**: Keep reference IDs and handle URL generation server-side

Example response (Option A - recommended):
```json
{
  "portfolioId": 8,
  "blocks": [
    {
      "id": 41,
      "type": "INTRO",
      "data": {
        "avatar": "https://storage.example.com/image_8_41.jpg",
        ...
      }
    }
  ]
}
```

### Frontend Display Flow

When portfolio is viewed:
```
┌──────────────────────────────────────────────────────────┐
│         fetchPortfolioByIdAPI(portfolioId)               │
│         Returns blocks with avatar field                 │
└──────────────────────────────────────────────────────────┘
                          ↓
    Block avatar contains: URL, reference ID, or null
                          ↓
┌──────────────────────────────────────────────────────────┐
│      IntroFive.tsx / IntroOne.tsx / etc.                │
│      <img src={resolveImageUrl(avatar)} />              │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│              resolveImageUrl() Logic                     │
│  if ("http://" or "https://") → return as-is ✅        │
│  if ("image_xxx") → find in Map → create blob URL ✅   │
│  if ("image_xxx") not in Map → return reference ID      │
│  other → return as-is                                   │
└──────────────────────────────────────────────────────────┘
                          ↓
                   Image displays!
```

---

## ✅ Testing Checklist

### 1. Check File Upload During Creation
```
□ Open portfolio creation template 5
□ Click IntroFive avatar upload
□ Select image file
□ Verify:
  - ✓ Image preview appears immediately
  - ✓ Console shows: "📸 Processing portfolio image: [filename]"
  - ✓ Console shows: "✅ Avatar processed successfully: image_xxx_yyy"
  - ✓ Console shows: "📸 Storing image file reference: image_xxx_yyy"
```

### 2. Check Form Data Preparation
```
□ Fill in all required fields
□ Click "Lưu hồ sơ"
□ Check Browser DevTools → Network tab:
  - Request to: POST /api/portfolio
  - Content-Type: multipart/form-data (NOT application/json!)
  - Payload contains:
    • portfolioJson (text field with JSON)
    • files (multipart file upload)
    
□ Console shows:
  - "📸 Appending X files to FormData"
  - "📸 All files appended to FormData, total size: X KB"
```

### 3. Check API Response
```
□ After save, check Network tab response:
  - Status: 200-201 (success)
  - Response contains blocks with avatar field
  
□ Avatar field should contain EITHER:
  A) Full HTTP URL: "https://..."
  B) Reference ID: "image_xxx_yyy"
  C) Null (if no file uploaded)
```

### 4. Check Image Display in Portfolio
```
□ Navigate to portfolio detail page
□ Check images display correctly
□ Check console logs:
  - If avatar is HTTP URL:
    "📸 Image is already an HTTP URL, using directly: ..."
  - If avatar is reference ID:
    "📸 Created blob URL for reference: image_xxx_yyy"
    "   Status: pending/uploaded/failed"
  - If avatar is null:
    (no logs - image not rendered)
```

### 5. Multiple Files Test
```
□ Upload avatar in IntroFive
□ Add project with image
□ Add other images
□ Check console: "📸 Appending X files to FormData"
  (should show correct total count)
□ After save, all images should display
```

### 6. Error Handling
```
□ Try uploading wrong file type (non-image)
  - Should show error: "Vui lòng chọn tệp ảnh."
  
□ Try uploading > 5MB file
  - Should show error: "Ảnh không được quá 5MB."
  
□ Network disconnected during upload
  - Check error message in UI
  - Check console: "❌ Cannot connect to server..."
```

---

## 🐛 Debugging Guide

### Image Not Showing in Preview
1. **Check console**:
   - Look for: `📸 Processing portfolio image` - file selected?
   - Look for: `✅ Avatar processed successfully` - reference ID created?
   - Look for: `📸 Avatar file stored for portfolio creation` - file stored?

2. **Check browser DevTools**:
   - Network tab: confirm image file sent in FormData
   - Console: check for blob URL creation errors

### Image Not Showing After Save
1. **Check API response**:
   - Does avatar field contain HTML URL, reference ID, or null?
   - If null: backend didn't receive file or processing failed

2. **Check console logs**:
   ```
   📸 Image is already an HTTP URL...
   → ✓ File was processed by backend, URL returned
   
   📸 Created blob URL for reference: image_xxx_yyy
   → ✓ Reference ID preserved, using in-memory file
   
   ⚠️ Image reference not found in stored files
   → ✗ Reference ID present but file not in memory
      (files may have been cleared)
   
   Available references: []
   → ✗ No files stored in memory at all
   ```

3. **Check Backend Response**:
   - POST `/api/portfolio` response should have `blocks[].data.avatar`
   - Format should be: URL OR reference ID OR null
   - If always null: backend may not be processing files

### Performance Issues
- Each `URL.createObjectURL()` creates a blob URL that persists
- To prevent memory leaks, add cleanup when component unmounts
- Consider calling `URL.revokeObjectURL(blobUrl)` when done viewing

---

## 📋 Expected Data Structures

### During Creation (in memory)
```typescript
portfolioImageFiles Map:
{
  "image_1712224329000_abc123": File { name: "avatar.jpg", size: 45000 },
  "image_1712224335000_def456": File { name: "project.png", size: 120000 }
}

fileUploadStatus Map:
{
  "image_1712224329000_abc123": { status: "pending" },
  "image_1712224335000_def456": { status: "pending" }
}
```

### In Block Data (sent to backend)
```json
{
  "type": "INTRO",
  "variant": "INTROFIVE",
  "data": {
    "avatar": "image_1712224329000_abc123",
    "name": "Nguyễn Thành Nhân",
    ...
  }
}
```

### After Save (backend response - Option A)
```json
{
  "portfolioId": 8,
  "blocks": [
    {
      "type": "INTRO",
      "data": {
        "avatar": "https://storage.example.com/portfolios/8/avatar.jpg",
        "name": "Nguyễn Thành Nhân",
        ...
      }
    }
  ]
}
```

---

## 🔧 Key Functions Reference

### Store & Upload
```typescript
// In editor component
uploadPortfolioImage(file, token)  // Returns reference ID

// In save handler
portfolioService.getPortfolioImageFiles()  // Get all File objects
portfolioService.storePortfolioImageFile(refId, file)  // Store file
portfolioService.clearPortfolioImageFiles()  // Clear map (rarely used now)
```

### Display
```typescript
resolveImageUrl(imageUrl)  // Convert ref IDs → blob URLs or use HTTP URLs directly

// For debugging
getFileUploadStatus(refId)  // Check if file is pending/uploaded/failed
getPortfolioImageFileMap()  // Get all reference IDs with blob URLs
```

### Status Tracking
```typescript
markFileAsUploaded(refId)  // Mark as successfully uploaded
markFileAsFailed(refId, error)  // Mark as failed with error message
```

---

## 🎯 Backend Integration Checklist

- [ ] Receive FormData with `portfolioJson` and `files`
- [ ] Parse `portfolioJson` to get block data with reference IDs
- [ ] Extract files from multipart upload
- [ ] Match each File to reference ID in block data
- [ ] Process files (validate, save to storage, generate URL)
- [ ] Create response with blocks containing URLs
- [ ] Return HTTP 200-201 with response data
- [ ] Handle errors gracefully (return 400 with error message)
- [ ] Validate file types and sizes server-side (don't trust frontend)
- [ ] Return data in expected format (see data structures above)

