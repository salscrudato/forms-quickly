import { useState, useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  Input,
  Textarea,
  SimpleGrid,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useFormUpload } from '@/hooks/useForms';
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormCategory, LineOfBusiness, FormUpload as FormUploadType } from '@/types';

const FormUpload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploading, progress, error, uploadForm } = useFormUpload();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    formNumber: '',
    category: '' as FormCategory | '',
    lineOfBusiness: '' as LineOfBusiness | '',
    stateApplicability: [] as string[],
    editionDate: '',
    effectiveDate: '',
    expirationDate: '',
    tags: '',
    version: '',
  });

  const categories: FormCategory[] = [
    'Application', 'Policy', 'Endorsement', 'Certificate', 
    'Claims', 'Underwriting', 'Billing', 'Other'
  ];

  const linesOfBusiness: LineOfBusiness[] = [
    'Auto', 'Property', 'General Liability', 'Workers Compensation',
    'Professional Liability', 'Cyber', 'Umbrella', 'Commercial Package',
    'Personal Lines', 'Other'
  ];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please select a PDF file');
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        alert('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a PDF file to upload');
      return;
    }

    try {
      // Parse tags
      const tags = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create form upload object
      const formUpload: FormUploadType = {
        file: selectedFile,
        metadata: {
          title: formData.title,
          description: formData.description || undefined,
          formNumber: formData.formNumber,
          category: formData.category as FormCategory,
          lineOfBusiness: formData.lineOfBusiness as LineOfBusiness,
          stateApplicability: formData.stateApplicability,
          editionDate: formData.editionDate,
          effectiveDate: formData.effectiveDate,
          expirationDate: formData.expirationDate || undefined,
          isActive: true,
          tags,
          version: formData.version,
          modifiedBy: '', // Will be set by the service
          uploadedBy: '', // Will be set by the service
        },
      };

      // Upload the form
      const formId = await uploadForm(formUpload);

      // Navigate to the new form's detail page
      navigate(`/forms/${formId}`);
    } catch (error) {
      console.error('Upload error:', error);
      // Error is handled by the hook
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <HStack gap={3} cursor="pointer" onClick={() => navigate(ROUTES.DASHBOARD)}>
            <Box 
              w="40px" 
              h="40px" 
              bg="blue.500" 
              rounded="md" 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
            >
              <Text color="white" fontWeight="bold" fontSize="lg">F</Text>
            </Box>
            <Heading size="lg" color="gray.800">{APP_NAME}</Heading>
          </HStack>
          
          <Button variant="outline" onClick={() => navigate(ROUTES.DASHBOARD)}>
            Cancel
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={6}>
        <VStack gap={6} align="stretch" maxW="4xl" mx="auto">
          {/* Page Header */}
          <Box textAlign="center">
            <Heading size="xl" mb={2}>Upload New Form</Heading>
            <Text color="gray.600">
              Add a new insurance form to the library
            </Text>
          </Box>

          {/* Upload Form */}
          <Box bg="white" p={8} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <form onSubmit={handleSubmit}>
              <VStack gap={6} align="stretch">
                {/* Basic Information */}
                <Box>
                  <Heading size="md" mb={4}>Basic Information</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Form Title *</Text>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Commercial General Liability Application"
                        required
                      />
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Form Number *</Text>
                      <Input
                        value={formData.formNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, formNumber: e.target.value }))}
                        placeholder="e.g., CGL-001-CA"
                        required
                      />
                    </Box>
                  </SimpleGrid>
                  
                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Description</Text>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the form and its purpose"
                      rows={3}
                    />
                  </Box>
                </Box>

                {/* Classification */}
                <Box>
                  <Heading size="md" mb={4}>Classification</Heading>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Category *</Text>
                      <select
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          backgroundColor: 'white'
                        }}
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          category: e.target.value as FormCategory 
                        }))}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Line of Business *</Text>
                      <select
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          backgroundColor: 'white'
                        }}
                        value={formData.lineOfBusiness}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          lineOfBusiness: e.target.value as LineOfBusiness 
                        }))}
                        required
                      >
                        <option value="">Select Line of Business</option>
                        {linesOfBusiness.map(lob => (
                          <option key={lob} value={lob}>{lob}</option>
                        ))}
                      </select>
                    </Box>
                  </SimpleGrid>
                </Box>

                {/* Dates and Version */}
                <Box>
                  <Heading size="md" mb={4}>Dates & Version</Heading>
                  <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Edition Date *</Text>
                      <Input
                        type="date"
                        value={formData.editionDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, editionDate: e.target.value }))}
                        required
                      />
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Effective Date *</Text>
                      <Input
                        type="date"
                        value={formData.effectiveDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
                        required
                      />
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" fontWeight="medium" mb={2}>Expiration Date</Text>
                      <Input
                        type="date"
                        value={formData.expirationDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      />
                    </Box>
                  </SimpleGrid>
                  
                  <Box mt={4}>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Version *</Text>
                    <Input
                      value={formData.version}
                      onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                      placeholder="e.g., 2024.1"
                      maxW="200px"
                      required
                    />
                  </Box>
                </Box>

                {/* File Upload */}
                <Box>
                  <Heading size="md" mb={4}>File Upload *</Heading>

                  {/* File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />

                  <Box
                    border="2px dashed"
                    borderColor={selectedFile ? "green.300" : "gray.300"}
                    rounded="lg"
                    p={8}
                    textAlign="center"
                    _hover={{ borderColor: "blue.400" }}
                    cursor="pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <VStack gap={3}>
                        <Text fontSize="lg" color="green.600" fontWeight="medium">
                          ✓ File Selected
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                          {selectedFile.name}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </Text>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}>
                          Remove File
                        </Button>
                      </VStack>
                    ) : (
                      <VStack gap={3}>
                        <Text fontSize="lg" color="gray.600" mb={2}>
                          Click to select your PDF file
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Supported format: PDF (Max size: 50MB)
                        </Text>
                        <Button variant="outline">
                          Choose File
                        </Button>
                      </VStack>
                    )}
                  </Box>

                  {/* Upload Progress */}
                  {uploading && progress && (
                    <Box mt={4}>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">
                          Uploading...
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {progress.percentage.toFixed(1)}%
                        </Text>
                      </Flex>
                      <Box
                        w="full"
                        bg="gray.200"
                        rounded="md"
                        h="2"
                        overflow="hidden"
                      >
                        <Box
                          bg="blue.500"
                          h="full"
                          rounded="md"
                          transition="width 0.3s ease"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </Box>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {(progress.bytesTransferred / 1024 / 1024).toFixed(2)} MB of{' '}
                        {(progress.totalBytes / 1024 / 1024).toFixed(2)} MB
                      </Text>
                    </Box>
                  )}

                  {/* Error Display */}
                  {error && (
                    <Box mt={4} p={3} bg="red.50" border="1px solid" borderColor="red.200" rounded="md">
                      <Text fontSize="sm" color="red.700">
                        {error}
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Tags */}
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Tags</Text>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="Enter tags separated by commas (e.g., liability, commercial, application)"
                  />
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    Tags help with search and organization
                  </Text>
                </Box>

                {/* Submit Buttons */}
                <HStack justify="end" gap={4} pt={6}>
                  <Button
                    variant="outline"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    disabled={uploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={uploading}
                    loadingText={progress ? `Uploading ${progress.percentage.toFixed(0)}%` : "Uploading..."}
                    disabled={
                      !formData.title ||
                      !formData.formNumber ||
                      !formData.category ||
                      !formData.lineOfBusiness ||
                      !formData.editionDate ||
                      !formData.effectiveDate ||
                      !formData.version ||
                      !selectedFile
                    }
                  >
                    Upload Form
                  </Button>
                </HStack>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default FormUpload;
