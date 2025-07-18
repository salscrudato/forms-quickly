import { FormsService } from '@/services/firestore';
import type { FormMetadata } from '@/types';

// Sample forms data for seeding
const sampleForms: Omit<FormMetadata, 'id' | 'lastModified' | 'uploadedAt'>[] = [
  {
    title: 'Commercial General Liability Application',
    description: 'Standard application form for commercial general liability insurance coverage. This form collects essential information about business operations, prior claims history, and risk exposures.',
    formNumber: 'CGL-001-CA',
    category: 'Application',
    stateApplicability: ['CA', 'NV', 'AZ'],
    editionDate: '2024-01-15',
    effectiveDate: '2024-02-01',
    isActive: true,
    tags: ['liability', 'commercial', 'application', 'general liability'],
    version: '2024.1',
    lineOfBusiness: 'General Liability',
    modifiedBy: 'system',
    uploadedBy: 'system',
  },
  {
    title: 'Workers Compensation Policy Form',
    description: 'Standard policy form for workers compensation coverage including employee classifications and premium calculations.',
    formNumber: 'WC-POL-002-TX',
    category: 'Policy',
    stateApplicability: ['TX', 'OK', 'LA'],
    editionDate: '2024-01-10',
    effectiveDate: '2024-01-15',
    isActive: true,
    tags: ['workers comp', 'policy', 'texas', 'employees'],
    version: '2024.1',
    lineOfBusiness: 'Workers Compensation',
    modifiedBy: 'system',
    uploadedBy: 'system',
  },
  {
    title: 'Auto Liability Endorsement - Excluded Driver',
    description: 'Endorsement to exclude specific drivers from auto liability coverage due to poor driving records or other risk factors.',
    formNumber: 'AUTO-END-003-NY',
    category: 'Endorsement',
    stateApplicability: ['NY', 'NJ', 'CT'],
    editionDate: '2024-01-08',
    effectiveDate: '2024-01-20',
    expirationDate: '2025-01-20',
    isActive: false,
    tags: ['auto', 'endorsement', 'excluded driver', 'liability'],
    version: '2023.3',
    lineOfBusiness: 'Auto',
    modifiedBy: 'system',
    uploadedBy: 'system',
  },
  {
    title: 'Property Insurance Certificate',
    description: 'Certificate of insurance for commercial property coverage including building and contents protection.',
    formNumber: 'PROP-CERT-004-FL',
    category: 'Certificate',
    stateApplicability: ['FL', 'GA', 'SC'],
    editionDate: '2024-01-20',
    effectiveDate: '2024-02-01',
    isActive: true,
    tags: ['property', 'certificate', 'commercial', 'building'],
    version: '2024.1',
    lineOfBusiness: 'Property',
    modifiedBy: 'system',
    uploadedBy: 'system',
  },
  {
    title: 'Cyber Liability Application',
    description: 'Application form for cyber liability insurance covering data breaches, network security, and privacy violations.',
    formNumber: 'CYBER-APP-005-CA',
    category: 'Application',
    stateApplicability: ['CA', 'WA', 'OR'],
    editionDate: '2024-01-25',
    effectiveDate: '2024-02-15',
    isActive: true,
    tags: ['cyber', 'liability', 'data breach', 'technology'],
    version: '2024.1',
    lineOfBusiness: 'Cyber',
    modifiedBy: 'system',
    uploadedBy: 'system',
  },
];

export const seedSampleData = async (userId: string): Promise<void> => {
  try {
    console.log('Starting to seed sample data...');
    
    for (const formData of sampleForms) {
      try {
        const formId = await FormsService.createForm(formData, userId);
        console.log(`Created form: ${formData.title} (ID: ${formId})`);
      } catch (error) {
        console.error(`Failed to create form: ${formData.title}`, error);
      }
    }
    
    console.log('Sample data seeding completed!');
  } catch (error) {
    console.error('Error seeding sample data:', error);
    throw error;
  }
};

// Function to clear all forms (for testing)
export const clearAllForms = async (): Promise<void> => {
  try {
    console.log('This function would clear all forms - implement with caution');
    // Implementation would require admin privileges
  } catch (error) {
    console.error('Error clearing forms:', error);
    throw error;
  }
};
