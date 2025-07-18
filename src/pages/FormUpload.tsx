import { useState } from 'react';
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
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormCategory, LineOfBusiness } from '@/types';

const FormUpload = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      // TODO: Implement actual form upload to Firebase
      console.log('Form data:', formData);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate back to forms page
      navigate(ROUTES.FORMS);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
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
                  <Heading size="md" mb={4}>File Upload</Heading>
                  <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    rounded="lg"
                    p={8}
                    textAlign="center"
                    _hover={{ borderColor: "blue.400" }}
                  >
                    <Text fontSize="lg" color="gray.600" mb={2}>
                      Drag and drop your PDF file here, or click to browse
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Supported format: PDF (Max size: 10MB)
                    </Text>
                    <Button mt={4} variant="outline">
                      Choose File
                    </Button>
                  </Box>
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
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorPalette="blue"
                    loading={isUploading}
                    loadingText="Uploading..."
                    disabled={!formData.title || !formData.formNumber || !formData.category}
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
