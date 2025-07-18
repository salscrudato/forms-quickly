import { useState, useEffect, useCallback, useRef } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { FormsService } from '@/services/firestore';
import { StorageService, UploadProgress } from '@/services/storage';
import type { FormMetadata, FormSearchFilters, FormStats, FormUpload } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Hook for managing forms list with search and filtering
export const useForms = (initialFilters?: FormSearchFilters) => {
  const [forms, setForms] = useState<FormMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | undefined>();
  const [filters, setFilters] = useState<FormSearchFilters>(initialFilters || {});
  const [searchQuery, setSearchQuery] = useState('');

  // Load forms
  const loadForms = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentLastDoc = reset ? undefined : lastDoc;
      
      let result;
      if (searchQuery.trim()) {
        // Use search when query is present
        const searchResults = await FormsService.searchForms(searchQuery, filters);
        result = { forms: searchResults, hasMore: false, lastDoc: undefined };
      } else {
        // Use regular filtering
        result = await FormsService.getForms(filters, 20, currentLastDoc);
      }

      if (reset) {
        setForms(result.forms);
      } else {
        setForms(prev => [...prev, ...result.forms]);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery, lastDoc]);

  // Load more forms (pagination)
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadForms(false);
    }
  }, [loading, hasMore, loadForms]);

  // Refresh forms list
  const refresh = useCallback(() => {
    setLastDoc(undefined);
    loadForms(true);
  }, [loadForms]);

  // Update search query
  const updateSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setLastDoc(undefined);
  }, []);

  // Update filters
  const updateFilters = useCallback((newFilters: FormSearchFilters) => {
    setFilters(newFilters);
    setLastDoc(undefined);
  }, []);

  // Initial load and reload when dependencies change
  useEffect(() => {
    refresh();
  }, [filters, searchQuery]);

  return {
    forms,
    loading,
    error,
    hasMore,
    searchQuery,
    filters,
    loadMore,
    refresh,
    updateSearch,
    updateFilters,
  };
};

// Hook for managing a single form
export const useForm = (formId: string) => {
  const [form, setForm] = useState<FormMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadForm = useCallback(async () => {
    if (!formId) return;

    try {
      setLoading(true);
      setError(null);
      
      const formData = await FormsService.getForm(formId, user?.uid);
      setForm(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form');
    } finally {
      setLoading(false);
    }
  }, [formId, user?.uid]);

  useEffect(() => {
    loadForm();
  }, [loadForm]);

  const updateForm = useCallback(async (updates: Partial<FormMetadata>) => {
    if (!form || !user?.uid) return;

    try {
      await FormsService.updateForm(form.id, updates, user.uid);
      setForm(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update form');
    }
  }, [form, user?.uid]);

  const deleteForm = useCallback(async () => {
    if (!form || !user?.uid) return;

    try {
      await FormsService.deleteForm(form.id, user.uid);
      setForm(null);
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete form');
    }
  }, [form, user?.uid]);

  return {
    form,
    loading,
    error,
    updateForm,
    deleteForm,
    refresh: loadForm,
  };
};

// Hook for form statistics
export const useFormStats = () => {
  const [stats, setStats] = useState<FormStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statsData = await FormsService.getFormStats();
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    stats,
    loading,
    error,
    refresh: loadStats,
  };
};

// Hook for uploading forms
export const useFormUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const abortController = useRef<AbortController | null>(null);

  const uploadForm = useCallback(async (formUpload: FormUpload): Promise<string> => {
    if (!user?.uid) {
      throw new Error('User must be authenticated to upload forms');
    }

    try {
      setUploading(true);
      setError(null);
      setProgress(null);
      
      // Create abort controller for cancellation
      abortController.current = new AbortController();

      // First create the form document
      const formId = await FormsService.createForm(formUpload.metadata, user.uid);

      // Then upload the file if provided
      if (formUpload.file) {
        const uploadResult = await StorageService.uploadFormFile(
          formUpload.file,
          formId,
          formUpload.metadata.version,
          (uploadProgress) => {
            setProgress(uploadProgress);
          }
        );

        // Update form with file information
        await FormsService.updateForm(formId, {
          fileUrl: uploadResult.downloadURL,
          fileSize: uploadResult.metadata.size,
        }, user.uid);
      }

      return formId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
      setProgress(null);
      abortController.current = null;
    }
  }, [user?.uid]);

  const cancelUpload = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
      setUploading(false);
      setProgress(null);
      setError('Upload cancelled');
    }
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadForm,
    cancelUpload,
  };
};

// Hook for real-time forms updates
export const useRealtimeForms = (filters?: FormSearchFilters) => {
  const [forms, setForms] = useState<FormMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const unsubscribe = FormsService.subscribeToForms(
      (updatedForms) => {
        setForms(updatedForms);
        setLoading(false);
      },
      filters
    );

    // Handle errors
    const handleError = (err: Error) => {
      setError(err.message);
      setLoading(false);
    };

    return () => {
      unsubscribe();
    };
  }, [filters]);

  return {
    forms,
    loading,
    error,
  };
};

// Hook for file operations
export const useFileOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadFile = useCallback(async (formId: string, fileName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const downloadURL = await StorageService.getDownloadURL(formId, fileName);
      
      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = useCallback(async (formId: string, fileName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await StorageService.deleteFormFile(formId, fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getFileMetadata = useCallback(async (formId: string, fileName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      return await StorageService.getFileMetadata(formId, fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get file metadata');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    downloadFile,
    deleteFile,
    getFileMetadata,
  };
};
