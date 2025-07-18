import { useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  Badge,
  SimpleGrid,
  Flex,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormMetadata } from '@/types';

const FormDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Mock form data - in real app, this would be fetched based on ID
  const mockForm: FormMetadata = {
    id: id || '1',
    title: 'Commercial General Liability Application',
    description: 'Standard application form for commercial general liability insurance coverage. This form collects essential information about the business operations, prior claims history, and risk exposures to determine appropriate coverage and pricing.',
    formNumber: 'CGL-001-CA',
    category: 'Application',
    stateApplicability: ['CA', 'NV', 'AZ'],
    editionDate: '2024-01-15T00:00:00Z',
    effectiveDate: '2024-02-01T00:00:00Z',
    expirationDate: '2025-02-01T00:00:00Z',
    isActive: true,
    tags: ['liability', 'commercial', 'application', 'general liability'],
    version: '2024.1',
    lineOfBusiness: 'General Liability',
    lastModified: '2024-01-15T10:30:00Z',
    modifiedBy: 'john.doe@company.com',
    uploadedAt: '2024-01-15T08:00:00Z',
    uploadedBy: 'john.doe@company.com',
    fileUrl: '/sample-form.pdf',
    fileSize: 245760,
  };

  const getStateName = (code: string) => {
    return US_STATES.find(state => state.code === code)?.name || code;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
          
          <HStack gap={3}>
            <Button variant="outline" onClick={() => navigate(ROUTES.FORMS)}>
              Back to Forms
            </Button>
            <Button colorPalette="blue">
              Edit Form
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={6}>
        <VStack gap={6} align="stretch">
          {/* Form Header */}
          <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <Flex justify="space-between" align="start" mb={4}>
              <VStack align="start" gap={2}>
                <HStack gap={3}>
                  <Heading size="xl" color="gray.800">
                    {mockForm.title}
                  </Heading>
                  <Badge 
                    colorPalette={mockForm.isActive ? 'green' : 'red'}
                    variant="subtle"
                    size="lg"
                  >
                    {mockForm.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </HStack>
                <Text fontSize="lg" color="blue.600" fontWeight="medium">
                  Form Number: {mockForm.formNumber}
                </Text>
                <Text color="gray.600">
                  {mockForm.description}
                </Text>
              </VStack>
              
              <VStack gap={2}>
                <Button
                  colorPalette="blue"
                  size="lg"
                  onClick={() => setIsPdfOpen(true)}
                  disabled={!mockForm.fileUrl}
                >
                  View PDF
                </Button>
                <Button variant="outline" size="sm">
                  Download
                </Button>
              </VStack>
            </Flex>

            {/* Quick Stats */}
            <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
              <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                <Text fontSize="sm" color="gray.500">Version</Text>
                <Text fontWeight="bold">{mockForm.version}</Text>
              </Box>
              <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                <Text fontSize="sm" color="gray.500">Category</Text>
                <Text fontWeight="bold">{mockForm.category}</Text>
              </Box>
              <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                <Text fontSize="sm" color="gray.500">Line of Business</Text>
                <Text fontWeight="bold">{mockForm.lineOfBusiness}</Text>
              </Box>
              <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                <Text fontSize="sm" color="gray.500">File Size</Text>
                <Text fontWeight="bold">
                  {mockForm.fileSize ? formatFileSize(mockForm.fileSize) : 'N/A'}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Detailed Information */}
          <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <VStack gap={8} align="stretch">
              {/* Details Section */}
              <Box>
                <Heading size="md" mb={4}>Form Details</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                    <VStack align="stretch" gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Form Number</Text>
                        <Text fontWeight="medium">{mockForm.formNumber}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Category</Text>
                        <Text fontWeight="medium">{mockForm.category}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Line of Business</Text>
                        <Text fontWeight="medium">{mockForm.lineOfBusiness}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Version</Text>
                        <Text fontWeight="medium">{mockForm.version}</Text>
                      </Box>
                    </VStack>

                    <VStack align="stretch" gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Status</Text>
                        <Badge 
                          colorPalette={mockForm.isActive ? 'green' : 'red'}
                          variant="subtle"
                        >
                          {mockForm.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>File Size</Text>
                        <Text fontWeight="medium">
                          {mockForm.fileSize ? formatFileSize(mockForm.fileSize) : 'No file uploaded'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Uploaded By</Text>
                        <Text fontWeight="medium">{mockForm.uploadedBy || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Last Modified By</Text>
                        <Text fontWeight="medium">{mockForm.modifiedBy}</Text>
                      </Box>
                    </VStack>
                </SimpleGrid>
              </Box>

              {/* States & Dates Section */}
              <Box>
                <Heading size="md" mb={4}>States & Dates</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={3}>Applicable States</Text>
                      <VStack align="stretch" gap={2}>
                        {mockForm.stateApplicability.map((state) => (
                          <HStack key={state} justify="space-between">
                            <Badge variant="outline">{state}</Badge>
                            <Text fontSize="sm">{getStateName(state)}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  </VStack>

                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Edition Date</Text>
                      <Text fontWeight="medium">
                        {new Date(mockForm.editionDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Effective Date</Text>
                      <Text fontWeight="medium">
                        {new Date(mockForm.effectiveDate).toLocaleDateString()}
                      </Text>
                    </Box>
                    {mockForm.expirationDate && (
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Expiration Date</Text>
                        <Text fontWeight="medium">
                          {new Date(mockForm.expirationDate).toLocaleDateString()}
                        </Text>
                      </Box>
                    )}
                    {mockForm.uploadedAt && (
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Uploaded Date</Text>
                        <Text fontWeight="medium">
                          {new Date(mockForm.uploadedAt).toLocaleDateString()}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </SimpleGrid>
              </Box>

              {/* History Section */}
              <Box>
                <Heading size="md" mb={4}>History</Heading>
                <VStack align="stretch" gap={4}>
                  <Box p={4} border="1px solid" borderColor="gray.200" rounded="lg">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">Form Updated</Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(mockForm.lastModified).toLocaleString()}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Updated by {mockForm.modifiedBy}
                    </Text>
                  </Box>

                  {mockForm.uploadedAt && (
                    <Box p={4} border="1px solid" borderColor="gray.200" rounded="lg">
                      <HStack justify="space-between" mb={2}>
                        <Text fontWeight="medium">Form Uploaded</Text>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(mockForm.uploadedAt).toLocaleString()}
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        Uploaded by {mockForm.uploadedBy}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>

              {/* Tags Section */}
              <Box>
                <Heading size="md" mb={4}>Tags</Heading>
                <HStack gap={2} flexWrap="wrap">
                  {mockForm.tags.map((tag, index) => (
                    <Badge key={index} variant="subtle" colorPalette="blue">
                      {tag}
                    </Badge>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </Box>

          {/* Actions */}
          <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <Heading size="md" mb={4}>Actions</Heading>
            <HStack gap={4} flexWrap="wrap">
              <Button colorPalette="blue">
                Edit Metadata
              </Button>
              <Button variant="outline">
                Upload New Version
              </Button>
              <Button variant="outline">
                Duplicate Form
              </Button>
              <Button variant="outline">
                Export Data
              </Button>
              <Button variant="outline" colorPalette="red">
                {mockForm.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Box>

      {/* PDF Viewer Placeholder */}
      {isPdfOpen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.800"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => setIsPdfOpen(false)}
        >
          <Box
            bg="white"
            p={6}
            rounded="lg"
            maxW="4xl"
            w="90%"
            h="80%"
            onClick={(e) => e.stopPropagation()}
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">
                {mockForm.title} - {mockForm.formNumber}
              </Heading>
              <Button size="sm" onClick={() => setIsPdfOpen(false)}>
                Close
              </Button>
            </Flex>
            <Box h="full" bg="gray.100" rounded="lg" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.500" textAlign="center">
                PDF Viewer would be implemented here
                <br />
                (Integration with PDF.js or similar library)
              </Text>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FormDetail;
