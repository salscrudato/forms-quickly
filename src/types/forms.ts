export interface FormMetadata {
  id: string;
  title: string;
  description?: string;
  formNumber: string;
  category: FormCategory;
  stateApplicability: string[]; // Array of state codes (e.g., ['CA', 'NY', 'TX'])
  editionDate: string; // ISO date string
  effectiveDate: string; // ISO date string
  expirationDate?: string; // ISO date string, optional
  isActive: boolean;
  tags: string[];
  fileUrl?: string; // URL to PDF file
  fileSize?: number; // File size in bytes
  uploadedAt?: string; // ISO date string
  uploadedBy?: string; // User ID
  lastModified: string; // ISO date string
  modifiedBy: string; // User ID
  version: string;
  lineOfBusiness: LineOfBusiness;
}

export type FormCategory = 
  | 'Application'
  | 'Policy'
  | 'Endorsement'
  | 'Certificate'
  | 'Claims'
  | 'Underwriting'
  | 'Billing'
  | 'Other';

export type LineOfBusiness =
  | 'Auto'
  | 'Property'
  | 'General Liability'
  | 'Workers Compensation'
  | 'Professional Liability'
  | 'Cyber'
  | 'Umbrella'
  | 'Commercial Package'
  | 'Personal Lines'
  | 'Other';

export interface FormSearchFilters {
  query?: string;
  category?: FormCategory;
  lineOfBusiness?: LineOfBusiness;
  states?: string[];
  isActive?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface FormUpload {
  file: File;
  metadata: Omit<FormMetadata, 'id' | 'fileUrl' | 'fileSize' | 'uploadedAt' | 'lastModified'>;
}

export interface FormStats {
  totalForms: number;
  activeForms: number;
  inactiveForms: number;
  recentUploads: number;
  formsByCategory: Record<FormCategory, number>;
  formsByState: Record<string, number>;
}
