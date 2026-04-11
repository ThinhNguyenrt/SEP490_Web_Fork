/**
 * IMPROVED handleSubmit FOR PORTFOLIO IMAGE UPLOAD
 * Properly handles multipart/form-data with files
 */

import axios, { AxiosProgressEvent } from 'axios';
import { PortfolioBlock } from '@/types/application';

interface PortfolioSubmitPayload {
  employeeId: number;
  name: string;
  blocks: PortfolioBlock[];
}

/**
 * Helper: Collect all file references from block data
 * Returns Map: referenceId -> {file: File, fieldName: string}
 */
function collectFilesFromBlocks(
  blocks: PortfolioBlock[]
): Map<string, { file: File; fieldName: string }> {
  const fileMap = new Map<string, { file: File; fieldName: string }>();
  const processedReferences = new Set<string>();
  
  // Assume you have access to stored image files
  // This map should be populated when images are selected/uploaded by user
  const portfolioImageFiles = getStoredPortfolioFiles(); // Import this from portfolio.api.ts
  
  let fileCounter = 0;

  // Deep scan through all block data to find file references
  const scanForReferences = (obj: any, depth = 0): void => {
    if (!obj || typeof obj !== 'object' || depth > 10) return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => scanForReferences(item, depth + 1));
    } else {
      Object.values(obj).forEach((value) => {
        // Check for file reference patterns
        if (typeof value === 'string') {
          const trimmed = value.trim();
          
          // Match patterns: avatar_*, image_*, project_*
          if (
            (trimmed.startsWith('avatar_') ||
              trimmed.startsWith('image_') ||
              trimmed.startsWith('project_')) &&
            !processedReferences.has(trimmed)
          ) {
            const file = portfolioImageFiles?.get(trimmed);
            if (file) {
              fileCounter++;
              // Generate field name based on reference type
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

  // Scan all blocks
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
 * Field names MUST match the names expected by backend
 */
function generateFieldName(referenceId: string, index: number): string {
  if (referenceId.startsWith('avatar_')) {
    // avatar1, avatar2, etc.
    return `avatar${index > 1 ? index : ''}`;
  } else if (referenceId.startsWith('project_')) {
    // project_image_1, project_image_2, etc.
    return `project_image_${index}`;
  } else if (referenceId.startsWith('image_')) {
    // image_1, image_2, etc.
    return `image_${index}`;
  }
  return `file_${index}`;
}

/**
 * Helper: Replace reference IDs in payload with field names
 * This ensures JSON contains the field names instead of temporary reference IDs
 */
function replaceReferencesWithFieldNames(
  payload: PortfolioSubmitPayload,
  fileMap: Map<string, { file: File; fieldName: string }>
): PortfolioSubmitPayload {
  // Deep clone to avoid mutations
  const newPayload = JSON.parse(JSON.stringify(payload));

  const replaceInObject = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => replaceInObject(item));
    } else {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          const trimmed = obj[key].trim();
          
          // If this reference ID has a corresponding file, replace with field name
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
 * Prepares multipart/form-data with portfolio JSON and image files
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

    // 1. Validate required data
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
    console.log(`📋 Payload:`, payload);

    // 2. Collect all image files from block data
    console.log('📸 Collecting image files from blocks...');
    const fileMap = collectFilesFromBlocks(payload.blocks);
    console.log(`📸 Total files collected: ${fileMap.size}`);

    // 3. Replace reference IDs in payload with field names
    console.log('🔄 Replacing reference IDs with field names...');
    const finalPayload = replaceReferencesWithFieldNames(payload, fileMap);
    console.log('✅ References replaced');
    console.log('📝 Final payload:', finalPayload);

    // 4. Create FormData
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

      // Calculate total size
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

    // 5. Determine API endpoint and method
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const isUpdate = isEditMode && portfolioId;
    const endpoint = isUpdate 
      ? `${baseUrl}/portfolio/${portfolioId}/full`
      : `${baseUrl}/portfolio`;
    const method = isUpdate ? 'PUT' : 'POST';

    console.log(`📡 API Endpoint: ${endpoint}`);
    console.log(`📡 Method: ${method}`);

    // 6. Send request with Axios
    console.log('🔐 Preparing request headers...');
    const config = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Don't set Content-Type - let FormData set it automatically with boundary
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

    // 7. Validate response
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

    // Handle specific error types
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

/**
 * Usage Example in React Component:
 * 
 * const handleSave = async () => {
 *   try {
 *     setSaving(true);
 *     setError(null);
 * 
 *     const payload: PortfolioSubmitPayload = {
 *       employeeId: user.employeeId || user.id,
 *       name: portfolioName.trim() || "My Portfolio",
 *       blocks: sortAndReindexBlocks(blocks).map(block => ({
 *         id: block.id,
 *         type: block.type,
 *         variant: block.variant,
 *         order: block.order,
 *         data: deepClone(block.data),
 *       })),
 *     };
 * 
 *     const result = await handleSubmit(
 *       payload,
 *       accessToken,
 *       isEditMode,
 *       editPortfolioId,
 *       (progress) => {
 *         // Handle upload progress
 *         const percent = Math.round((progress.loaded / progress.total) * 100);
 *         console.log(`Upload progress: ${percent}%`);
 *       }
 *     );
 * 
 *     notify.success("Portfolio saved successfully!");
 *     navigate("/portfolioManagement?refresh=true", { replace: true });
 *   } catch (error) {
 *     const message = error instanceof Error ? error.message : "Failed to save";
 *     setError(message);
 *     notify.error(message);
 *   } finally {
 *     setSaving(false);
 *   }
 * };
 */
