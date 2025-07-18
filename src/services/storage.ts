import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata,
  updateMetadata,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from '@/firebase';

// Storage paths
const STORAGE_PATHS = {
  FORMS: 'forms',
  TEMP: 'temp',
  THUMBNAILS: 'thumbnails',
} as const;

export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  md5Hash?: string;
  customMetadata?: Record<string, string>;
}

export class StorageService {
  // Upload a form PDF with progress tracking
  static uploadFormFile(
    file: File,
    formId: string,
    version: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ downloadURL: string; metadata: FileMetadata }> {
    return new Promise((resolve, reject) => {
      try {
        // Validate file
        this.validateFormFile(file);
        
        // Create file path
        const fileName = this.generateFileName(file.name, formId, version);
        const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
        const storageRef = ref(storage, filePath);
        
        // Set custom metadata
        const metadata = {
          contentType: file.type,
          customMetadata: {
            formId,
            version,
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
          },
        };
        
        // Start upload with progress tracking
        const uploadTask: UploadTask = uploadBytesResumable(storageRef, file, metadata);
        
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              percentage: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              state: snapshot.state as UploadProgress['state'],
            };
            
            onProgress?.(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            try {
              // Upload completed successfully
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const fileMetadata = await getMetadata(uploadTask.snapshot.ref);
              
              const result = {
                downloadURL,
                metadata: {
                  name: fileName,
                  size: fileMetadata.size,
                  type: fileMetadata.contentType || file.type,
                  lastModified: Date.now(),
                  md5Hash: fileMetadata.md5Hash,
                  customMetadata: fileMetadata.customMetadata,
                },
              };
              
              resolve(result);
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error}`));
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  // Upload file without progress tracking (for smaller files)
  static async uploadFormFileSimple(
    file: File,
    formId: string,
    version: string
  ): Promise<{ downloadURL: string; metadata: FileMetadata }> {
    try {
      // Validate file
      this.validateFormFile(file);
      
      // Create file path
      const fileName = this.generateFileName(file.name, formId, version);
      const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      // Set custom metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          formId,
          version,
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
        },
      };
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const fileMetadata = await getMetadata(snapshot.ref);
      
      return {
        downloadURL,
        metadata: {
          name: fileName,
          size: fileMetadata.size,
          type: fileMetadata.contentType || file.type,
          lastModified: Date.now(),
          md5Hash: fileMetadata.md5Hash,
          customMetadata: fileMetadata.customMetadata,
        },
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Upload failed: ${error}`);
    }
  }

  // Delete a form file
  static async deleteFormFile(formId: string, fileName: string): Promise<void> {
    try {
      const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete file: ${error}`);
    }
  }

  // Get file metadata
  static async getFileMetadata(formId: string, fileName: string): Promise<FileMetadata> {
    try {
      const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      const metadata = await getMetadata(storageRef);
      
      return {
        name: fileName,
        size: metadata.size,
        type: metadata.contentType || 'application/pdf',
        lastModified: new Date(metadata.updated).getTime(),
        md5Hash: metadata.md5Hash,
        customMetadata: metadata.customMetadata,
      };
    } catch (error) {
      console.error('Metadata error:', error);
      throw new Error(`Failed to get file metadata: ${error}`);
    }
  }

  // Get download URL for a file
  static async getDownloadURL(formId: string, fileName: string): Promise<string> {
    try {
      const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Download URL error:', error);
      throw new Error(`Failed to get download URL: ${error}`);
    }
  }

  // Update file metadata
  static async updateFileMetadata(
    formId: string,
    fileName: string,
    customMetadata: Record<string, string>
  ): Promise<void> {
    try {
      const filePath = `${STORAGE_PATHS.FORMS}/${formId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      await updateMetadata(storageRef, { customMetadata });
    } catch (error) {
      console.error('Update metadata error:', error);
      throw new Error(`Failed to update file metadata: ${error}`);
    }
  }

  // List all files for a form
  static async listFormFiles(formId: string): Promise<FileMetadata[]> {
    try {
      // Note: Firebase Storage doesn't have a direct list operation in the client SDK
      // This would typically be implemented using Firebase Functions or Admin SDK
      // For now, we'll return an empty array and implement this server-side
      console.warn('listFormFiles should be implemented server-side');
      return [];
    } catch (error) {
      console.error('List files error:', error);
      throw new Error(`Failed to list files: ${error}`);
    }
  }

  // Validate form file
  private static validateFormFile(file: File): void {
    // Check file type
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only PDF files are allowed');
    }
    
    // Check file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB');
    }
    
    // Check file name
    if (!file.name || file.name.trim() === '') {
      throw new Error('File must have a valid name');
    }
  }

  // Generate unique file name
  private static generateFileName(originalName: string, formId: string, version: string): string {
    const timestamp = Date.now();
    const extension = originalName.split('.').pop() || 'pdf';
    const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
    
    return `${baseName}_v${version}_${timestamp}.${extension}`;
  }

  // Get file size in human readable format
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate thumbnail (would require server-side processing)
  static async generateThumbnail(formId: string, fileName: string): Promise<string> {
    try {
      // This would typically be implemented using Firebase Functions
      // with PDF processing libraries like pdf-poppler or pdf2pic
      console.warn('generateThumbnail should be implemented server-side');
      return '';
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      throw new Error(`Failed to generate thumbnail: ${error}`);
    }
  }

  // Batch upload multiple files
  static async uploadMultipleFiles(
    files: File[],
    formId: string,
    version: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
  ): Promise<Array<{ downloadURL: string; metadata: FileMetadata }>> {
    try {
      const uploadPromises = files.map((file, index) => 
        this.uploadFormFile(
          file,
          formId,
          `${version}_${index + 1}`,
          (progress) => onProgress?.(index, progress)
        )
      );
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Batch upload error:', error);
      throw new Error(`Batch upload failed: ${error}`);
    }
  }

  // Create a signed URL for temporary access (would require server-side implementation)
  static async createSignedURL(
    formId: string,
    fileName: string,
    expirationMinutes: number = 60
  ): Promise<string> {
    try {
      // This would typically be implemented using Firebase Functions
      // with the Admin SDK to create signed URLs
      console.warn('createSignedURL should be implemented server-side');
      return await this.getDownloadURL(formId, fileName);
    } catch (error) {
      console.error('Signed URL error:', error);
      throw new Error(`Failed to create signed URL: ${error}`);
    }
  }
}
