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
import { useForm } from '@/hooks/useForms';
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormMetadata } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const FormDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isPdfOpen, setIsPdfOpen] = useState(false);

  // Use the real form hook to get form data
  const { form: formData, loading, error } = useForm(id || '');

  // Helper function to display empty values
  const displayValue = (value: string | undefined | null): string => {
    return value && value.trim() ? value : '-';
  };

  const getStateName = (code: string) => {
    return US_STATES.find(state => state.code === code)?.name || code;
  };

  const formatFileSize = (bytes: number | undefined) => {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return '-';
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
        {/* Loading State */}
        {loading && (
          <Box textAlign="center" py={12}>
            <LoadingSpinner />
            <Text mt={4} color="gray.600">Loading form details...</Text>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Box textAlign="center" py={12}>
            <Text color="red.500" mb={4}>{error}</Text>
            <Button onClick={() => navigate(ROUTES.FORMS)} variant="outline">
              Back to Forms
            </Button>
          </Box>
        )}

        {/* Form Not Found */}
        {!loading && !error && !formData && (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500" mb={4}>Form not found</Text>
            <Button onClick={() => navigate(ROUTES.FORMS)} variant="outline">
              Back to Forms
            </Button>
          </Box>
        )}

        {/* Form Content */}
        {!loading && !error && formData && (
          <VStack gap={6} align="stretch">
            {/* Form Header */}
            <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
              <Flex justify="space-between" align="start" mb={4}>
                <VStack align="start" gap={2}>
                  <HStack gap={3}>
                    <Heading size="xl" color="gray.800">
                      {displayValue(formData.title)}
                    </Heading>
                    <Badge
                      colorPalette={formData.isActive ? 'green' : 'red'}
                      variant="subtle"
                      size="lg"
                    >
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </HStack>
                  <Text fontSize="lg" color="blue.600" fontWeight="medium">
                    Form Number: {displayValue(formData.formNumber)}
                  </Text>
                  <Text color="gray.600">
                    {displayValue(formData.description)}
                  </Text>
                </VStack>

                <VStack gap={2}>
                  <Button
                    colorPalette="blue"
                    size="lg"
                    onClick={() => setIsPdfOpen(true)}
                    disabled={!formData.fileUrl}
                  >
                    View PDF
                  </Button>
                  <Button variant="outline" size="sm" disabled={!formData.fileUrl}>
                    Download
                  </Button>
                </VStack>
              </Flex>

              {/* Quick Stats */}
              <SimpleGrid columns={{ base: 2, md: 4 }} gap={4}>
                <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                  <Text fontSize="sm" color="gray.500">Version</Text>
                  <Text fontWeight="bold">{displayValue(formData.version)}</Text>
                </Box>
                <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                  <Text fontSize="sm" color="gray.500">Category</Text>
                  <Text fontWeight="bold">{displayValue(formData.category)}</Text>
                </Box>
                <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                  <Text fontSize="sm" color="gray.500">Line of Business</Text>
                  <Text fontWeight="bold">{displayValue(formData.lineOfBusiness)}</Text>
                </Box>
                <Box textAlign="center" p={3} bg="gray.50" rounded="lg">
                  <Text fontSize="sm" color="gray.500">File Size</Text>
                  <Text fontWeight="bold">{formatFileSize(formData.fileSize)}</Text>
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
                        <Text fontWeight="medium">{displayValue(formData.formNumber)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Category</Text>
                        <Text fontWeight="medium">{displayValue(formData.category)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Line of Business</Text>
                        <Text fontWeight="medium">{displayValue(formData.lineOfBusiness)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Version</Text>
                        <Text fontWeight="medium">{displayValue(formData.version)}</Text>
                      </Box>
                    </VStack>

                    <VStack align="stretch" gap={4}>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Status</Text>
                        <Badge
                          colorPalette={formData.isActive ? 'green' : 'red'}
                          variant="subtle"
                        >
                          {formData.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>File Size</Text>
                        <Text fontWeight="medium">{formatFileSize(formData.fileSize)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Uploaded By</Text>
                        <Text fontWeight="medium">{displayValue(formData.uploadedBy)}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="gray.500" mb={1}>Last Modified By</Text>
                        <Text fontWeight="medium">{displayValue(formData.modifiedBy)}</Text>
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
                        {formData.stateApplicability && formData.stateApplicability.length > 0 ? (
                          formData.stateApplicability.map((state) => (
                          <HStack key={state} justify="space-between">
                            <Badge variant="outline">{state}</Badge>
                            <Text fontSize="sm">{getStateName(state)}</Text>
                          </HStack>
                        ))
                        ) : (
                          <Text fontWeight="medium">-</Text>
                        )}
                      </VStack>
                    </Box>
                  </VStack>

                  <VStack align="stretch" gap={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Edition Date</Text>
                      <Text fontWeight="medium">{formatDate(formData.editionDate)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Effective Date</Text>
                      <Text fontWeight="medium">{formatDate(formData.effectiveDate)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Expiration Date</Text>
                      <Text fontWeight="medium">{formatDate(formData.expirationDate)}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>Uploaded Date</Text>
                      <Text fontWeight="medium">{formatDate(formData.uploadedAt)}</Text>
                    </Box>
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
                        {formData.lastModified ? new Date(formData.lastModified).toLocaleString() : '-'}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Updated by {displayValue(formData.modifiedBy)}
                    </Text>
                  </Box>

                  <Box p={4} border="1px solid" borderColor="gray.200" rounded="lg">
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="medium">Form Uploaded</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formData.uploadedAt ? new Date(formData.uploadedAt).toLocaleString() : '-'}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      Uploaded by {displayValue(formData.uploadedBy)}
                    </Text>
                  </Box>
                </VStack>
              </Box>

              {/* Tags Section */}
              <Box>
                <Heading size="md" mb={4}>Tags</Heading>
                {formData.tags && formData.tags.length > 0 ? (
                  <HStack gap={2} flexWrap="wrap">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="subtle" colorPalette="blue">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                ) : (
                  <Text fontWeight="medium">-</Text>
                )}
              </Box>
            </VStack>
          </Box>
          </VStack>
        )}
      </Box>

      {/* PDF Viewer Placeholder */}
      {isPdfOpen && formData && (
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
                {displayValue(formData.title)} - {displayValue(formData.formNumber)}
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
