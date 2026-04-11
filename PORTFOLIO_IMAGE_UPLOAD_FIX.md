# Portfolio Image Upload - Complete Integration Guide

## Problem Summary
Images were not being saved because:
1. Files need to be collected from `portfolioImageFiles` Map using reference IDs (avatar_*, image_*, project_*)
2. FormData requires field names that match the names referenced in the JSON payload
3. The JSON payload must use field names instead of temporary reference IDs

## Solution Architecture

### 1. **File Storage Flow**
```
┌─────────────────────────────────────────────────────┐
│ User selects image in editor component              │
├─────────────────────────────────────────────────────┤
│ generateImageReferenceId() → "avatar_1234567890_xyz"│
├─────────────────────────────────────────────────────┤
│ storePortfolioImageFile(refId, file)                │
│ → portfolioImageFiles.set(refId, file)              │
├─────────────────────────────────────────────────────┤
│ Block data stores refId: "avatar_1234567890_xyz"    │
└─────────────────────────────────────────────────────┘
```

### 2. **Submission Flow**
```
┌──────────────────────────────────────────────────────┐
│ User clicks Save button                              │
├──────────────────────────────────────────────────────┤
│ handleSave() prepares payload with block data         │
│ (contains reference IDs like avatar_*)               │
├──────────────────────────────────────────────────────┤
│ collectFilesFromBlocks(blocks)                        │
│ → Scans all block data for avatar_*, image_*, etc.   │
│ → Returns Map: refId → {file, fieldName}            │
├──────────────────────────────────────────────────────┤
│ replaceReferencesWithFieldNames(payload, fileMap)    │
│ → Replaces references in JSON with field names      │
│ → JSON now has avatar="avatar1", image="image_1"    │
├──────────────────────────────────────────────────────┤
│ Create FormData:                                      │
│ ├─ Add portfolioJson (stringified payload)           │
│ ├─ Add avatar1 = File                               │
│ ├─ Add image_1 = File                               │
│ └─ Add project_image_1 = File                       │
├──────────────────────────────────────────────────────┤
│ Send via Axios with Bearer token                     │
└──────────────────────────────────────────────────────┘
```

## Implementation Steps

### Step 1: Update CreatePortfolio.tsx

Replace the `handleSave` function with the improved version:

```typescript
// At the top of CreatePortfolio.tsx, add new imports:
import { handleSubmit } from '@/services/portfolio-submit.handler'; // New file
import axios from 'axios';

// Inside CreatePortfolio component, replace handleSave:
const handleSave = async () => {
  // Check if user is authenticated
  if (!user || !accessToken) {
    setError("Bạn cần đăng nhập để lưu hồ sơ.");
    navigate("/login");
    return;
  }

  if (blocks.length === 0) {
    setError("Bạn cần thêm ít nhất một block trước khi lưu.");
    return;
  }

  try {
    setSaving(true);
    setError(null);

    console.log("👤 Current user object:", user);

    // Prepare the portfolio data structure
    const portfolioData = {
      employeeId: user.employeeId || user.id,
      name: portfolioName.trim() || "Hồ sơ mới",
      blocks: sortAndReindexBlocks(blocks).map((block) => ({
        id: block.id,
        type: normalizeBlockType(block.type),
        variant: block.variant.toUpperCase(),
        order: block.order,
        data: deepClone(block.data),
      })),
    };

    console.log("💾 Saving portfolio:", portfolioData);

    // Use the new handleSubmit with progress tracking
    const result = await handleSubmit(
      portfolioData,
      accessToken,
      isEditMode,
      isEditMode ? Number(id) : undefined,
      (progress) => {
        // Optional: handle upload progress
        const percent = Math.round((progress.loaded / progress.total) * 100);
        console.log(`📊 Upload progress: ${percent}%`);
      }
    );

    console.log("✅ Portfolio saved successfully:", result);
    notify.success(
      isEditMode ? "Hồ sơ đã được cập nhật thành công!" : "Hồ sơ đã được lưu thành công!"
    );

    // Clear stored image files after successful upload
    portfolioService.clearPortfolioImageFiles();
    console.log("📸 Cleared stored image files after successful portfolio save");

    // Navigate to portfolio management page
    navigate("/portfolioManagement?refresh=true", { replace: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Không thể lưu portfolio.";
    console.error("❌ Error:", message);
    setError(message);
    notify.error(message);
  } finally {
    setSaving(false);
  }
};
```

### Step 2: Create New Handler File

Create `src/services/portfolio-submit.handler.ts`:

```typescript
import axios, { AxiosProgressEvent } from 'axios';
import type { PortfolioBlock } from '@/types/application';
import { portfolioService } from './portfolio.api';

interface PortfolioSubmitPayload {
  employeeId: number;
  name: string;
  blocks: PortfolioBlock[];
}

/**
 * Helper: Collect all file references from block data
 */
function collectFilesFromBlocks(
  blocks: PortfolioBlock[]
): Map<string, { file: File; fieldName: string }> {
  const fileMap = new Map<string, { file: File; fieldName: string }>();
  const processedReferences = new Set<string>();
  
  const portfolioImageFiles = portfolioService.getPortfolioImageFilesMap();
  let fileCounter = 0;

  const scanForReferences = (obj: any, depth = 0): void => {
    if (!obj || typeof obj !== 'object' || depth > 10) return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => scanForReferences(item, depth + 1));
    } else {
      Object.values(obj).forEach((value) => {
        if (typeof value === 'string') {
          const trimmed = value.trim();
          
          if (
            (trimmed.startsWith('avatar_') ||
              trimmed.startsWith('image_') ||
              trimmed.startsWith('project_')) &&
            !processedReferences.has(trimmed)
          ) {
            const file = portfolioImageFiles?.get(trimmed);
            if (file) {
              fileCounter++;
              const fieldName = generateFieldName(trimmed, fileCounter);
              fileMap.set(trimmed, { file, fieldName });
              processedReferences.add(trimmed);
              
              console.log(
                `✅ Found file: ${trimmed} -> Field: ${fieldName}, File: ${file.name}`
              );
            } else {
              console.warn(`⚠️ Reference found but file missing: ${trimmed}`);
            }
          }
        } else if (typeof value === 'object') {
          scanForReferences(value, depth + 1);
        }
      });
    }
  };

  blocks.forEach((block) => {
    if (block.data) {
      scanForReferences(block.data);
    }
  });

  console.log(`📦 Collected ${fileMap.size} files from blocks`);
  return fileMap;
}

/**
 * Helper: Generate field name for form data
 */
function generateFieldName(referenceId: string, index: number): string {
  if (referenceId.startsWith('avatar_')) {
    return `avatar${index > 1 ? index : ''}`;
  } else if (referenceId.startsWith('project_')) {
    return `project_image_${index}`;
  } else if (referenceId.startsWith('image_')) {
    return `image_${index}`;
  }
  return `file_${index}`;
}

/**
 * Helper: Replace reference IDs in payload with field names
 */
function replaceReferencesWithFieldNames(
  payload: PortfolioSubmitPayload,
  fileMap: Map<string, { file: File; fieldName: string }>
): PortfolioSubmitPayload {
  const newPayload = JSON.parse(JSON.stringify(payload));

  const replaceInObject = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => replaceInObject(item));
    } else {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          const trimmed = obj[key].trim();
          
          if (fileMap.has(trimmed)) {
            const { fieldName } = fileMap.get(trimmed)!;
            obj[key] = fieldName;
            console.log(`📝 Replaced reference ${trimmed} -> ${fieldName}`);
          }
        } else if (typeof obj[key] === 'object') {
          replaceInObject(obj[key]);
        }
      }
    }
  };

  replaceInObject(newPayload);
  return newPayload;
}

/**
 * MAIN: handleSubmit function
 */
export async function handleSubmit(
  payload: PortfolioSubmitPayload,
  accessToken: string,
  isEditMode: boolean = false,
  portfolioId?: number,
  onUploadProgress?: (progress: AxiosProgressEvent) => void
): Promise<{ portfolioId: number; message: string }> {
  try {
    console.log('🚀 Starting portfolio submission...');

    // Validate required data
    if (!payload.employeeId) {
      throw new Error('❌ Employee ID is required');
    }
    if (!accessToken) {
      throw new Error('❌ Access token is required. Please login again.');
    }
    if (!payload.blocks || payload.blocks.length === 0) {
      throw new Error('❌ Portfolio must have at least one block');
    }

    console.log('✅ Validation passed');

    // Collect all image files from block data
    console.log('📸 Collecting image files from blocks...');
    const fileMap = collectFilesFromBlocks(payload.blocks);
    console.log(`📸 Total files collected: ${fileMap.size}`);

    // Replace reference IDs in payload with field names
    console.log('🔄 Replacing reference IDs with field names...');
    const finalPayload = replaceReferencesWithFieldNames(payload, fileMap);
    console.log('✅ References replaced');

    // Create FormData
    console.log('📦 Creating FormData...');
    const formData = new FormData();

    // Add JSON as text field
    const jsonString = JSON.stringify(finalPayload);
    console.log(
      `📄 JSON size: ${new Blob([jsonString]).size} bytes`
    );
    formData.append('portfolioJson', jsonString);
    console.log('✅ Added portfolioJson to FormData');

    // Add each file with its field name
    if (fileMap.size > 0) {
      console.log(`📸 Adding ${fileMap.size} files to FormData...`);
      
      fileMap.forEach(({ file, fieldName }, referenceId) => {
        formData.append(fieldName, file, file.name);
        console.log(
          `   ✅ Added: ${fieldName} = ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
        );
      });

      let totalSize = new Blob([jsonString]).size;
      fileMap.forEach(({ file }) => {
        totalSize += file.size;
      });
      console.log(
        `📦 Total FormData size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
      );
    } else {
      console.log('⚠️ No image files to upload (JSON only submission)');
    }

    // Determine API endpoint and method
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const isUpdate = isEditMode && portfolioId;
    const endpoint = isUpdate 
      ? `${baseUrl}/portfolio/${portfolioId}/full`
      : `${baseUrl}/portfolio`;
    const method = isUpdate ? 'PUT' : 'POST';

    console.log(`📡 API Endpoint: ${endpoint}`);
    console.log(`📡 Method: ${method}`);

    // Send request with Axios
    console.log('🔐 Preparing request headers...');
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type - let FormData set it automatically
      },
      onUploadProgress: onUploadProgress,
      timeout: 120000, // 2 minutes
    };

    console.log('📡 Sending request...');
    const response = await axios({
      method,
      url: endpoint,
      data: formData,
      ...config,
    });

    console.log('✅ Request completed');
    console.log(`📊 Response status: ${response.status}`);
    console.log('📨 Response data:', response.data);

    // Validate response
    if (!response.data || typeof response.data.portfolioId === 'undefined') {
      throw new Error('Invalid response format - missing portfolioId');
    }

    console.log(
      `✅ Portfolio ${isUpdate ? 'updated' : 'created'} successfully!`
    );
    console.log(`📇 Portfolio ID: ${response.data.portfolioId}`);

    return response.data;
  } catch (error) {
    console.error('❌ Portfolio submission failed:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error(
          'Authentication failed. Your session may have expired. Please login again.'
        );
      } else if (error.response?.status === 413) {
        throw new Error(
          'File size too large. Please upload smaller images or fewer files.'
        );
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection.');
      } else {
        const message = error.response?.data?.message || error.message;
        throw new Error(`Server error: ${message}`);
      }
    } else if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred during portfolio submission');
  }
}
```

### Step 3: Key Points for Image Editors

When users upload images in editors (e.g., IntroOneEditor), ensure:

```typescript
// In your image upload handler:
import { portfolioService } from '@/services/portfolio.api';

const handleImageUpload = (file: File) => {
  // Generate reference ID
  const referenceId = portfolioService.generateImageReferenceId('avatar');
  
  // Store the file
  portfolioService.storePortfolioImageFile(referenceId, file);
  
  // Use the reference ID in block data
  setBlockData({
    ...blockData,
    avatar: referenceId,  // Store reference, not URL
  });
};
```

## Testing Checklist

- [ ] User uploads image in editor
- [ ] Reference ID (avatar_*, image_*) is stored in block data
- [ ] Files are stored in portfolioImageFiles Map
- [ ] Click Save button
- [ ] handleSubmit collects all files from blocks
- [ ] FormData contains portfolioJson + all image files
- [ ] Each file has correct field name (avatar1, image_1, etc.)
- [ ] Portfolio JSON contains field names, not reference IDs
- [ ] API receives multipart/form-data correctly
- [ ] Images are saved on backend
- [ ] Check browser Network tab:
  - Content-Type should be multipart/form-data with boundary
  - Form data should show portfolioJson + file fields
  - Response should include portfolioId

## Common Issues & Fixes

### Issue: Files not found when submitting
**Solution**: Ensure images uploaded in editors use `storePortfolioImageFile(refId, file)` to store in portfolioImageFiles Map

### Issue: FormData appears empty
**Solution**: Check that reference IDs in block data match keys in portfolioImageFiles Map exactly

### Issue: Backend says "missing portfolio"
**Solution**: Ensure portfolioJson is properly stringified and passed as text field in FormData

### Issue: 413 Payload Too Large
**Solution**: Compress images, upload fewer files, or split into multiple requests
