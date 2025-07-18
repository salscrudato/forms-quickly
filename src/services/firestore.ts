import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  serverTimestamp,
  increment,
  writeBatch,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/firebase';
import type { FormMetadata, FormSearchFilters, FormStats } from '@/types';

// Collection references
const COLLECTIONS = {
  FORMS: 'forms',
  FORM_VERSIONS: 'formVersions',
  FORM_ANALYTICS: 'formAnalytics',
  USER_ACTIVITY: 'userActivity',
  TAGS: 'tags',
  CATEGORIES: 'categories',
} as const;

// Firestore document interfaces
export interface FirestoreForm extends Omit<FormMetadata, 'id'> {
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  createdBy: string;
  downloadCount: number;
  viewCount: number;
  searchKeywords: string[]; // For better search performance
  isDeleted: boolean;
  deletedAt?: any;
  deletedBy?: string;
}

export interface FormVersion {
  id?: string;
  formId: string;
  version: string;
  fileUrl: string;
  fileSize: number;
  fileName: string;
  uploadedAt: any;
  uploadedBy: string;
  isActive: boolean;
  changeLog?: string;
  checksumMD5?: string;
}

export interface FormAnalytics {
  id?: string;
  formId: string;
  date: string; // YYYY-MM-DD format
  views: number;
  downloads: number;
  searches: number;
  uniqueUsers: string[];
}

export interface UserActivity {
  id?: string;
  userId: string;
  action: 'view' | 'download' | 'upload' | 'edit' | 'delete' | 'search';
  formId?: string;
  metadata?: Record<string, any>;
  timestamp: any;
  ipAddress?: string;
  userAgent?: string;
}

// Forms Service
export class FormsService {
  // Create a new form
  static async createForm(formData: Omit<FormMetadata, 'id' | 'lastModified' | 'uploadedAt'>, userId: string): Promise<string> {
    try {
      const searchKeywords = this.generateSearchKeywords(formData);
      
      const firestoreForm: Omit<FirestoreForm, 'id'> = {
        ...formData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: userId,
        modifiedBy: userId,
        downloadCount: 0,
        viewCount: 0,
        searchKeywords,
        isDeleted: false,
        lastModified: new Date().toISOString(),
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId,
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.FORMS), firestoreForm);
      
      // Log user activity
      await this.logUserActivity(userId, 'upload', docRef.id);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating form:', error);
      throw new Error('Failed to create form');
    }
  }

  // Get all forms with optional filtering and pagination
  static async getForms(
    filters?: FormSearchFilters,
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ forms: FormMetadata[]; lastDoc?: DocumentSnapshot; hasMore: boolean }> {
    try {
      const constraints: QueryConstraint[] = [
        where('isDeleted', '==', false),
        orderBy('updatedAt', 'desc'),
      ];

      // Apply filters
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters?.lineOfBusiness) {
        constraints.push(where('lineOfBusiness', '==', filters.lineOfBusiness));
      }
      
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }
      
      if (filters?.states && filters.states.length > 0) {
        constraints.push(where('stateApplicability', 'array-contains-any', filters.states));
      }

      // Add pagination
      constraints.push(limit(pageSize));
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, COLLECTIONS.FORMS), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const forms: FormMetadata[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings
        lastModified: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().lastModified,
        uploadedAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().uploadedAt,
        editionDate: doc.data().editionDate,
        effectiveDate: doc.data().effectiveDate,
        expirationDate: doc.data().expirationDate,
      } as FormMetadata));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.docs.length === pageSize;

      return { forms, lastDoc: lastVisible, hasMore };
    } catch (error) {
      console.error('Error getting forms:', error);
      throw new Error('Failed to fetch forms');
    }
  }

  // Search forms with text query
  static async searchForms(
    searchQuery: string,
    filters?: FormSearchFilters,
    pageSize: number = 20
  ): Promise<FormMetadata[]> {
    try {
      if (!searchQuery.trim()) {
        const result = await this.getForms(filters, pageSize);
        return result.forms;
      }

      const keywords = searchQuery.toLowerCase().split(' ').filter(word => word.length > 0);
      
      const constraints: QueryConstraint[] = [
        where('isDeleted', '==', false),
        where('searchKeywords', 'array-contains-any', keywords),
        orderBy('updatedAt', 'desc'),
        limit(pageSize),
      ];

      // Apply additional filters
      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }
      
      if (filters?.isActive !== undefined) {
        constraints.push(where('isActive', '==', filters.isActive));
      }

      const q = query(collection(db, COLLECTIONS.FORMS), ...constraints);
      const querySnapshot = await getDocs(q);
      
      const forms: FormMetadata[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().lastModified,
        uploadedAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().uploadedAt,
      } as FormMetadata));

      return forms;
    } catch (error) {
      console.error('Error searching forms:', error);
      throw new Error('Failed to search forms');
    }
  }

  // Get a single form by ID
  static async getForm(formId: string, userId?: string): Promise<FormMetadata | null> {
    try {
      const docRef = doc(db, COLLECTIONS.FORMS, formId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists() || docSnap.data().isDeleted) {
        return null;
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: increment(1),
      });

      // Log user activity
      if (userId) {
        await this.logUserActivity(userId, 'view', formId);
        await this.updateAnalytics(formId, 'view', userId);
      }

      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        lastModified: data.updatedAt?.toDate?.()?.toISOString() || data.lastModified,
        uploadedAt: data.createdAt?.toDate?.()?.toISOString() || data.uploadedAt,
      } as FormMetadata;
    } catch (error) {
      console.error('Error getting form:', error);
      throw new Error('Failed to fetch form');
    }
  }

  // Update a form
  static async updateForm(formId: string, updates: Partial<FormMetadata>, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.FORMS, formId);
      
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp(),
        modifiedBy: userId,
        lastModified: new Date().toISOString(),
      };

      // Regenerate search keywords if title, description, or tags changed
      if (updates.title || updates.description || updates.tags) {
        const currentDoc = await getDoc(docRef);
        if (currentDoc.exists()) {
          const currentData = currentDoc.data();
          const updatedFormData = { ...currentData, ...updates };
          (updateData as any).searchKeywords = this.generateSearchKeywords(updatedFormData);
        }
      }

      await updateDoc(docRef, updateData);
      
      // Log user activity
      await this.logUserActivity(userId, 'edit', formId, updates);
    } catch (error) {
      console.error('Error updating form:', error);
      throw new Error('Failed to update form');
    }
  }

  // Soft delete a form
  static async deleteForm(formId: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.FORMS, formId);
      
      await updateDoc(docRef, {
        isDeleted: true,
        deletedAt: serverTimestamp(),
        deletedBy: userId,
        updatedAt: serverTimestamp(),
      });
      
      // Log user activity
      await this.logUserActivity(userId, 'delete', formId);
    } catch (error) {
      console.error('Error deleting form:', error);
      throw new Error('Failed to delete form');
    }
  }

  // Get form statistics
  static async getFormStats(): Promise<FormStats> {
    try {
      const formsQuery = query(
        collection(db, COLLECTIONS.FORMS),
        where('isDeleted', '==', false)
      );
      
      const querySnapshot = await getDocs(formsQuery);
      const forms = querySnapshot.docs.map(doc => doc.data());
      
      const totalForms = forms.length;
      const activeForms = forms.filter(form => form.isActive).length;
      const inactiveForms = totalForms - activeForms;
      
      // Calculate recent uploads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentUploads = forms.filter(form => {
        const createdAt = form.createdAt?.toDate?.() || new Date(form.uploadedAt);
        return createdAt >= thirtyDaysAgo;
      }).length;

      // Group by category
      const formsByCategory = forms.reduce((acc, form) => {
        const category = form.category as string;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Group by state
      const formsByState = forms.reduce((acc, form) => {
        form.stateApplicability?.forEach((state: string) => {
          acc[state] = (acc[state] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>);

      return {
        totalForms,
        activeForms,
        inactiveForms,
        recentUploads,
        formsByCategory: formsByCategory as any,
        formsByState,
      };
    } catch (error) {
      console.error('Error getting form stats:', error);
      throw new Error('Failed to fetch form statistics');
    }
  }

  // Real-time listener for forms
  static subscribeToForms(
    callback: (forms: FormMetadata[]) => void,
    filters?: FormSearchFilters
  ): Unsubscribe {
    const constraints: QueryConstraint[] = [
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc'),
      limit(50), // Limit for real-time updates
    ];

    if (filters?.category) {
      constraints.push(where('category', '==', filters.category));
    }

    const q = query(collection(db, COLLECTIONS.FORMS), ...constraints);
    
    return onSnapshot(q, (querySnapshot) => {
      const forms: FormMetadata[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastModified: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().lastModified,
        uploadedAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().uploadedAt,
      } as FormMetadata));
      
      callback(forms);
    });
  }

  // Helper methods
  private static generateSearchKeywords(formData: any): string[] {
    const keywords = new Set<string>();
    
    // Add title words
    if (formData.title) {
      formData.title.toLowerCase().split(/\s+/).forEach((word: string) => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add form number
    if (formData.formNumber) {
      keywords.add(formData.formNumber.toLowerCase());
    }
    
    // Add description words
    if (formData.description) {
      formData.description.toLowerCase().split(/\s+/).forEach((word: string) => {
        if (word.length > 2) keywords.add(word);
      });
    }
    
    // Add tags
    if (formData.tags) {
      formData.tags.forEach((tag: string) => {
        keywords.add(tag.toLowerCase());
      });
    }
    
    // Add category and line of business
    if (formData.category) keywords.add(formData.category.toLowerCase());
    if (formData.lineOfBusiness) keywords.add(formData.lineOfBusiness.toLowerCase());
    
    return Array.from(keywords);
  }

  private static async logUserActivity(
    userId: string,
    action: UserActivity['action'],
    formId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      const activity: Omit<UserActivity, 'id'> = {
        userId,
        action,
        formId,
        metadata,
        timestamp: serverTimestamp(),
      };
      
      await addDoc(collection(db, COLLECTIONS.USER_ACTIVITY), activity);
    } catch (error) {
      console.error('Error logging user activity:', error);
      // Don't throw error for logging failures
    }
  }

  private static async updateAnalytics(
    formId: string,
    action: 'view' | 'download',
    userId: string
  ): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const analyticsId = `${formId}_${today}`;
      const docRef = doc(db, COLLECTIONS.FORM_ANALYTICS, analyticsId);
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const uniqueUsers = new Set(data.uniqueUsers || []);
        uniqueUsers.add(userId);
        
        await updateDoc(docRef, {
          [action === 'view' ? 'views' : 'downloads']: increment(1),
          uniqueUsers: Array.from(uniqueUsers),
        });
      } else {
        const analytics: Omit<FormAnalytics, 'id'> = {
          formId,
          date: today,
          views: action === 'view' ? 1 : 0,
          downloads: action === 'download' ? 1 : 0,
          searches: 0,
          uniqueUsers: [userId],
        };
        
        await updateDoc(docRef, analytics);
      }
    } catch (error) {
      console.error('Error updating analytics:', error);
      // Don't throw error for analytics failures
    }
  }
}
