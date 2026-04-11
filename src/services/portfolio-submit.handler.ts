import axios, { AxiosProgressEvent } from 'axios';
import type { PortfolioBlock } from '@/types/application';
import { portfolioService } from './portfolio.api';

export interface PortfolioSubmitPayload {
  employeeId: number;
  name: string;
  blocks: PortfolioBlock[];
}

/**
 * Generate field name for FormData based on reference ID pattern
 * avatar_* → avatar, avatar1, avatar2, ...
 * image_* → image_1, image_2, ...
 * project_* → project_image_1, project_image_2, ...
 */
function generateFieldName(referenceId: string, index: number): string {
  if (referenceId.startsWith('avatar_')) {
    // First avatar is "avatar", rest are "avatar2", "avatar3", etc.
    return `avatar${index > 1 ? index : ''}`;
  } else if (referenceId.startsWith('project_')) {
    return `project_image_${index}`;
  } else if (referenceId.startsWith('image_')) {
    return `image_${index}`;
  }
  return `file_${index}`;
}

/**
 * Collect all file references from portfolio blocks
 * Scans block data recursively for reference IDs (avatar_*, image_*, project_*)
 * Returns a Map: referenceId → {file: File, fieldName: string}
 */
function collectFilesFromBlocks(
  blocks: PortfolioBlock[]
): Map<string, { file: File; fieldName: string }> {
  const fileMap = new Map<string, { file: File; fieldName: string }>();
  const processedReferences = new Set<string>();

  // Get the stored image files Map
  const portfolioImageFiles = portfolioService.getPortfolioImageFilesMap();
  let fileCounter = 0;

  /**
   * Recursively scan objects and arrays for file reference strings
   */
  const scanForReferences = (obj: any, depth = 0): void => {
    // Stop if not an object or too deep
    if (!obj || typeof obj !== 'object' || depth > 10) return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => scanForReferences(item, depth + 1));
    } else {
      Object.values(obj).forEach((value) => {
        // Check if value is a file reference string
        if (typeof value === 'string') {
          const trimmed = value.trim();

          // Match file reference patterns
          if (
            (trimmed.startsWith('avatar_') ||
              trimmed.startsWith('project_')) &&
            !processedReferences.has(trimmed)
          ) {
            // Try to get the actual file from storage
            const file = portfolioImageFiles?.get(trimmed);

            if (file) {
              fileCounter++;
              const fieldName = generateFieldName(trimmed, fileCounter);
              fileMap.set(trimmed, { file, fieldName });
              processedReferences.add(trimmed);

              console.log(
                `✅ Found file: ${trimmed} → Field: ${fieldName}, File: ${file.name}`
              );
            } else {
              console.warn(`⚠️ Reference found but file missing in storage: ${trimmed}`);
            }
          }
        } else if (typeof value === 'object') {
          // Recursively scan nested objects
          scanForReferences(value, depth + 1);
        }
      });
    }
  };

  // Scan all blocks for file references
  blocks.forEach((block) => {
    if (block.data) {
      scanForReferences(block.data);
    }
  });

  console.log(`📦 Total files collected from blocks: ${fileMap.size}`);
  if (fileMap.size > 0) {
    console.log(
      `📦 File mappings: ${Array.from(fileMap.entries())
        .map(([ref, { fieldName }]) => `${ref} → ${fieldName}`)
        .join(', ')}`
    );
  }

  return fileMap;
}

/**
 * Replace all reference IDs in the payload with their corresponding field names
 * This ensures the JSON sent to backend contains the field names, not temporary reference IDs
 * 
 * Special handling for avatar fields:
 * - Replaces "avatar" key with "avatarKey" 
 * - Replaces reference ID with file name as per backend requirement
 * Example: {"avatar": "avatar_xyz"} → {"avatarKey": "avatar.jpg"}
 */
function replaceReferencesWithFieldNames(
  payload: PortfolioSubmitPayload,
  fileMap: Map<string, { file: File; fieldName: string }>
): PortfolioSubmitPayload {
  // Deep clone to avoid mutating original
  const newPayload = JSON.parse(JSON.stringify(payload)) as PortfolioSubmitPayload;

  /**
   * Recursively replace references in objects and arrays
   */
  const replaceInObject = (obj: any): void => {
    if (!obj || typeof obj !== 'object') return;

    if (Array.isArray(obj)) {
      obj.forEach((item) => replaceInObject(item));
    } else {
      const keysToProcess = Object.keys(obj);
      
      for (const key of keysToProcess) {
        if (typeof obj[key] === 'string') {
          const trimmed = obj[key].trim();

          // If this reference ID has a file, replace with field name or avatar key
          if (fileMap.has(trimmed)) {
            const { file, fieldName } = fileMap.get(trimmed)!;
            
            // Special handling for avatar fields
            if (key === 'avatar' && trimmed.startsWith('avatar_')) {
              // Replace "avatar" key with "avatarKey"
              delete obj[key];
              // Value is the uploaded file name
              obj['avatarKey'] = file.name;
              console.log(`📝 Replaced avatar reference: ${trimmed} → avatarKey: ${file.name}`);
            } else {
              // For image and project fields, replace with field name
              obj[key] = fieldName;
              console.log(`📝 Replaced: ${trimmed} → ${fieldName}`);
            }
          }
        } else if (typeof obj[key] === 'object') {
          // Recursively process nested objects
          replaceInObject(obj[key]);
        }
      }
    }
  };

  replaceInObject(newPayload);
  return newPayload;
}

/**
 * Main function: Submit portfolio with images via multipart/form-data
 *
 * @param payload Portfolio data with blocks
 * @param accessToken JWT token for authentication
 * @param isEditMode Whether updating existing portfolio
 * @param portfolioId Portfolio ID if updating
 * @param onUploadProgress Optional callback for upload progress
 * @returns Response with portfolioId
 *
 * @example
 * const result = await handleSubmit(
 *   {
 *     employeeId: 123,
 *     name: "My Portfolio",
 *     blocks: [...],
 *   },
 *   "Bearer token here",
 *   false,
 *   undefined,
 *   (progress) => console.log(`${Math.round(progress.loaded/progress.total * 100)}%`)
 * );
 */
export async function handleSubmit(
  payload: PortfolioSubmitPayload,
  accessToken: string,
  isEditMode: boolean = false,
  portfolioId?: number,
  onUploadProgress?: (progress: AxiosProgressEvent) => void
): Promise<{ portfolioId: number; message: string }> {
  let uploadStartTime = 0;

  try {
    console.log('🚀 Starting portfolio submission...');
    uploadStartTime = Date.now();

    // ============== VALIDATION ==============
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
    console.log(`📋 Payload summary:`, {
      employeeId: payload.employeeId,
      name: payload.name,
      blockCount: payload.blocks.length,
    });

    // ============== COLLECT FILES ==============
    console.log('📸 Collecting image files from blocks...');
    const fileMap = collectFilesFromBlocks(payload.blocks);
    console.log(`📸 Total files collected: ${fileMap.size}`);

    // ============== REPLACE REFERENCES ==============
    console.log('🔄 Replacing reference IDs with field names...');
    const finalPayload = replaceReferencesWithFieldNames(payload, fileMap);
    console.log('✅ All references replaced in payload');

    // ============== CREATE FORMDATA ==============
    console.log('📦 Creating FormData...');
    const formData = new FormData();

    // Add JSON payload as text field
    const jsonString = JSON.stringify(finalPayload);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    formData.append('portfolioJson', jsonString);
    console.log(`📄 Added portfolioJson field (${jsonBlob.size} bytes)`);

    // Log the JSON structure (first 500 chars for debugging)
    console.log(`📄 JSON structure:`, JSON.stringify(finalPayload, null, 2).substring(0, 500));

    // Add each file with its field name
    if (fileMap.size > 0) {
      console.log(`📸 Adding ${fileMap.size} image files to FormData...`);

      fileMap.forEach(({ file, fieldName }, referenceId) => {
        formData.append(fieldName, file, file.name);
        console.log(
          `   ✅ ${fieldName}: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
        );
      });

      // Calculate total FormData size
      let totalSize = jsonBlob.size;
      fileMap.forEach(({ file }) => {
        totalSize += file.size;
      });
      console.log(
        `📦 Total FormData size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`
      );
    } else {
      console.log('⚠️ No image files - submitting JSON only');
    }

    // ============== PREPARE REQUEST ==============
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
    const isUpdate = isEditMode && portfolioId;
    const endpoint = isUpdate
      ? `${baseUrl}/portfolio/${portfolioId}/full`
      : `${baseUrl}/portfolio`;
    const method = isUpdate ? 'PUT' : 'POST';

    console.log(`📡 API Endpoint: ${endpoint}`);
    console.log(`📡 Method: ${method}`);
    console.log('🔐 Token: Provided', `(${accessToken.length} chars)`);

    // ============== SEND REQUEST ==============
    console.log('📤 Sending request to server...');

    const response = await axios({
      method,
      url: endpoint,
      data: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Note: Don't set Content-Type header here
        // FormData will set it automatically with proper multipart boundary
      },
      onUploadProgress,
      timeout: 120000, // 2 minutes timeout
    });

    const uploadDuration = Date.now() - uploadStartTime;
    console.log('✅ Request completed successfully');
    console.log(`📊 Response status: ${response.status}`);
    console.log(`⏱️ Upload duration: ${(uploadDuration / 1000).toFixed(2)}s`);
    console.log('📨 Response data:', response.data);

    // ============== VALIDATE RESPONSE ==============
    if (!response.data || typeof response.data.portfolioId === 'undefined') {
      throw new Error('Invalid response format - missing portfolioId in response');
    }

    console.log(
      `🎉 Portfolio ${isUpdate ? 'updated' : 'created'} successfully!`
    );
    console.log(`📇 Portfolio ID: ${response.data.portfolioId}`);
    console.log(`💬 Message: ${response.data.message || 'Success'}`);

    return response.data;

    // ============== ERROR HANDLING ==============
  } catch (error) {
    const uploadDuration = Date.now() - uploadStartTime;
    console.error('❌ Portfolio submission failed');
    console.error(`⏱️ Failed after: ${(uploadDuration / 1000).toFixed(2)}s`);
    console.error('Error:', error);

    // Handle Axios-specific errors
    if (axios.isAxiosError(error)) {
      console.error('📡 Axios Error Details:');
      console.error(`   Status: ${error.response?.status}`);
      console.error(`   StatusText: ${error.response?.statusText}`);
      console.error(`   Response: ${JSON.stringify(error.response?.data)}`);

      if (error.response?.status === 401) {
        throw new Error(
          'Authentication failed (401). Your session may have expired. Please login again.'
        );
      } else if (error.response?.status === 403) {
        throw new Error('Access denied (403). You do not have permission to save this portfolio.');
      } else if (error.response?.status === 413) {
        throw new Error(
          'File size too large (413). Please upload smaller images or fewer files.'
        );
      } else if (error.response?.status === 422) {
        const validationError = error.response.data?.errors || error.response.data?.message;
        throw new Error(`Validation error: ${JSON.stringify(validationError)}`);
      } else if (error.code === 'ECONNABORTED') {
        throw new Error(
          'Request timeout (120s exceeded). Please check your internet connection or try with fewer/smaller files.'
        );
      } else if (error.code === 'ERR_NETWORK') {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          `Server error: ${error.response?.status}`;
        throw new Error(`Server error: ${message}`);
      }
    }

    // Handle standard errors
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unknown error occurred during portfolio submission');
  }
}
