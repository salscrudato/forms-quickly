import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  SimpleGrid,
  Flex,
  Checkbox,
  IconButton,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormMetadata, FormSearchFilters, FormCategory, LineOfBusiness } from '@/types';

const Forms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FormSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from navigation state if available
  useEffect(() => {
    if (location.state) {
      const { searchQuery: initialQuery, filters: initialFilters } = location.state as any;
      if (initialQuery) setSearchQuery(initialQuery);
      if (initialFilters) setFilters(initialFilters);
    }
  }, [location.state]);

  // Mock forms data
  const mockForms: FormMetadata[] = [
    {
      id: '1',
      title: 'Commercial General Liability Application',
      description: 'Standard application form for commercial general liability insurance',
      formNumber: 'CGL-001-CA',
      category: 'Application',
      stateApplicability: ['CA', 'NV', 'AZ'],
      editionDate: '2024-01-15T00:00:00Z',
      effectiveDate: '2024-02-01T00:00:00Z',
      isActive: true,
      tags: ['liability', 'commercial', 'application'],
      version: '2024.1',
      lineOfBusiness: 'General Liability',
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'user123',
      fileSize: 245760,
    },
    {
      id: '2',
      title: 'Workers Compensation Policy Form',
      description: 'Standard policy form for workers compensation coverage',
      formNumber: 'WC-POL-002-TX',
      category: 'Policy',
      stateApplicability: ['TX', 'OK', 'LA'],
      editionDate: '2024-01-10T00:00:00Z',
      effectiveDate: '2024-01-15T00:00:00Z',
      isActive: true,
      tags: ['workers comp', 'policy', 'texas'],
      version: '2024.1',
      lineOfBusiness: 'Workers Compensation',
      lastModified: '2024-01-10T14:20:00Z',
      modifiedBy: 'user456',
      fileSize: 189440,
    },
    {
      id: '3',
      title: 'Auto Liability Endorsement - Excluded Driver',
      description: 'Endorsement to exclude specific drivers from auto liability coverage',
      formNumber: 'AUTO-END-003-NY',
      category: 'Endorsement',
      stateApplicability: ['NY', 'NJ', 'CT'],
      editionDate: '2024-01-08T00:00:00Z',
      effectiveDate: '2024-01-20T00:00:00Z',
      expirationDate: '2025-01-20T00:00:00Z',
      isActive: false,
      tags: ['auto', 'endorsement', 'excluded driver'],
      version: '2023.3',
      lineOfBusiness: 'Auto',
      lastModified: '2024-01-08T09:15:00Z',
      modifiedBy: 'user789',
      fileSize: 156672,
    },
  ];

  const filteredForms = mockForms.filter(form => {
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesQuery = 
        form.title.toLowerCase().includes(query) ||
        form.formNumber.toLowerCase().includes(query) ||
        form.description?.toLowerCase().includes(query) ||
        form.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!matchesQuery) return false;
    }

    // Category filter
    if (filters.category && form.category !== filters.category) {
      return false;
    }

    // Line of business filter
    if (filters.lineOfBusiness && form.lineOfBusiness !== filters.lineOfBusiness) {
      return false;
    }

    // Active status filter
    if (filters.isActive !== undefined && form.isActive !== filters.isActive) {
      return false;
    }

    // State filter
    if (filters.states && filters.states.length > 0) {
      const hasMatchingState = filters.states.some(state => 
        form.stateApplicability.includes(state)
      );
      if (!hasMatchingState) return false;
    }

    return true;
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
          
          <Button 
            colorPalette="blue" 
            onClick={() => navigate(ROUTES.FORM_UPLOAD)}
          >
            Upload Form
          </Button>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={6}>
        <VStack gap={6} align="stretch">
          {/* Page Header */}
          <Box>
            <Heading size="xl" mb={2}>Forms Library</Heading>
            <Text color="gray.600">
              {filteredForms.length} of {mockForms.length} forms
            </Text>
          </Box>

          {/* Search and Filters */}
          <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <VStack gap={4} align="stretch">
              {/* Search Bar */}
              <HStack gap={3}>
                <Input
                  placeholder="Search forms by title, number, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="lg"
                  flex="1"
                />
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
              </HStack>

              {/* Filters */}
              {showFilters && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Category</Text>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        backgroundColor: 'white'
                      }}
                      value={filters.category || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({
                        ...prev,
                        category: e.target.value as FormCategory || undefined
                      }))}
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Line of Business</Text>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        backgroundColor: 'white'
                      }}
                      value={filters.lineOfBusiness || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({
                        ...prev,
                        lineOfBusiness: e.target.value as LineOfBusiness || undefined
                      }))}
                    >
                      <option value="">All Lines</option>
                      {linesOfBusiness.map(lob => (
                        <option key={lob} value={lob}>{lob}</option>
                      ))}
                    </select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Status</Text>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '6px',
                        backgroundColor: 'white'
                      }}
                      value={filters.isActive === undefined ? '' : filters.isActive.toString()}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilters(prev => ({
                        ...prev,
                        isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                      }))}
                    >
                      <option value="">All Status</option>
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium" mb={2}>Actions</Text>
                    <HStack gap={2}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSearchQuery('');
                          setFilters({});
                        }}
                      >
                        Clear All
                      </Button>
                    </HStack>
                  </Box>
                </SimpleGrid>
              )}
            </VStack>
          </Box>

          {/* Forms Grid */}
          <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6}>
            {filteredForms.map((form) => (
              <Box
                key={form.id}
                bg="white"
                p={6}
                rounded="xl"
                shadow="sm"
                border="1px solid"
                borderColor="gray.200"
                _hover={{ borderColor: 'blue.300', shadow: 'md' }}
                cursor="pointer"
                onClick={() => navigate(`/forms/${form.id}`)}
                transition="all 0.2s"
              >
                <VStack align="stretch" gap={4}>
                  {/* Header */}
                  <Flex justify="space-between" align="start">
                    <Badge 
                      colorPalette={form.isActive ? 'green' : 'red'}
                      variant="subtle"
                    >
                      {form.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Text fontSize="xs" color="gray.500">
                      v{form.version}
                    </Text>
                  </Flex>

                  {/* Title and Form Number */}
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color="gray.800" mb={1}>
                      {form.title}
                    </Text>
                    <Text fontSize="sm" color="blue.600" fontWeight="medium">
                      {form.formNumber}
                    </Text>
                  </Box>

                  {/* Description */}
                  {form.description && (
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {form.description}
                    </Text>
                  )}

                  {/* Metadata */}
                  <VStack align="stretch" gap={2} fontSize="sm">
                    <HStack justify="space-between">
                      <Text color="gray.500">Category:</Text>
                      <Text fontWeight="medium">{form.category}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.500">Line of Business:</Text>
                      <Text fontWeight="medium">{form.lineOfBusiness}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text color="gray.500">Edition Date:</Text>
                      <Text fontWeight="medium">
                        {new Date(form.editionDate).toLocaleDateString()}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* States */}
                  <Box>
                    <Text fontSize="sm" color="gray.500" mb={2}>Applicable States:</Text>
                    <HStack gap={1} flexWrap="wrap">
                      {form.stateApplicability.map((state) => (
                        <Badge key={state} variant="outline" size="sm">
                          {state}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>

                  {/* File Info */}
                  {form.fileSize && (
                    <HStack justify="space-between" fontSize="xs" color="gray.500">
                      <Text>Size: {(form.fileSize / 1024).toFixed(1)} KB</Text>
                      <Text>
                        Modified: {new Date(form.lastModified).toLocaleDateString()}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Empty State */}
          {filteredForms.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500" mb={4}>
                No forms found matching your criteria
              </Text>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
              >
                Clear Filters
              </Button>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Forms;
