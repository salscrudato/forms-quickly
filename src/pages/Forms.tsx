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
import { useForms } from '@/hooks/useForms';
import { ROUTES, APP_NAME, US_STATES } from '@/constants';
import type { FormMetadata, FormSearchFilters, FormCategory, LineOfBusiness } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const Forms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [localFilters, setLocalFilters] = useState<FormSearchFilters>({});

  // Use the real forms hook
  const {
    forms,
    loading,
    error,
    searchQuery,
    filters,
    updateSearch,
    updateFilters,
    refresh
  } = useForms();

  // Initialize from navigation state if available
  useEffect(() => {
    if (location.state) {
      const { searchQuery: initialQuery, filters: initialFilters } = location.state as any;
      if (initialQuery) {
        setLocalSearchQuery(initialQuery);
        updateSearch(initialQuery);
      }
      if (initialFilters) {
        setLocalFilters(initialFilters);
        updateFilters(initialFilters);
      }
    }
  }, [location.state, updateSearch, updateFilters]);

  // Helper function to display empty values
  const displayValue = (value: string | undefined | null): string => {
    return value && value.trim() ? value : '-';
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

  // Handle local filter changes
  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value);
    updateSearch(value);
  };

  const handleFilterChange = (newFilters: FormSearchFilters) => {
    setLocalFilters(newFilters);
    updateFilters(newFilters);
  };

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
              {loading ? 'Loading...' : `${forms.length} forms`}
            </Text>
          </Box>

          {/* Search and Filters */}
          <Box bg="white" p={6} rounded="xl" shadow="sm" border="1px solid" borderColor="gray.200">
            <VStack gap={4} align="stretch">
              {/* Search Bar */}
              <HStack gap={3}>
                <Input
                  placeholder="Search forms by title, number, description, or tags..."
                  value={localSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
                      value={localFilters.category || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newFilters = {
                          ...localFilters,
                          category: e.target.value as FormCategory || undefined
                        };
                        handleFilterChange(newFilters);
                      }}
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
                      value={localFilters.lineOfBusiness || ''}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newFilters = {
                          ...localFilters,
                          lineOfBusiness: e.target.value as LineOfBusiness || undefined
                        };
                        handleFilterChange(newFilters);
                      }}
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
                      value={localFilters.isActive === undefined ? '' : localFilters.isActive.toString()}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const newFilters = {
                          ...localFilters,
                          isActive: e.target.value === '' ? undefined : e.target.value === 'true'
                        };
                        handleFilterChange(newFilters);
                      }}
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
                          setLocalSearchQuery('');
                          setLocalFilters({});
                          handleSearchChange('');
                          handleFilterChange({});
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

          {/* Loading State */}
          {loading && (
            <Box textAlign="center" py={12}>
              <LoadingSpinner />
              <Text mt={4} color="gray.600">Loading forms...</Text>
            </Box>
          )}

          {/* Error State */}
          {error && (
            <Box textAlign="center" py={12}>
              <Text color="red.500" mb={4}>{error}</Text>
              <Button onClick={refresh} variant="outline">
                Try Again
              </Button>
            </Box>
          )}

          {/* Forms Grid */}
          {!loading && !error && (
            <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} gap={6}>
              {forms.map((form) => (
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
                      {displayValue(form.description)}
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
                      <Text fontWeight="medium">{formatDate(form.editionDate)}</Text>
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
                  <HStack justify="space-between" fontSize="xs" color="gray.500">
                    <Text>Size: {formatFileSize(form.fileSize)}</Text>
                    <Text>Modified: {formatDate(form.lastModified)}</Text>
                  </HStack>
                </VStack>
              </Box>
              ))}
            </SimpleGrid>
          )}

          {/* Empty State */}
          {!loading && !error && forms.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text fontSize="lg" color="gray.500" mb={4}>
                {searchQuery || Object.keys(localFilters).length > 0
                  ? 'No forms found matching your criteria'
                  : 'No forms available'}
              </Text>
              {searchQuery || Object.keys(localFilters).length > 0 ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocalSearchQuery('');
                    setLocalFilters({});
                    handleSearchChange('');
                    handleFilterChange({});
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button
                  colorPalette="blue"
                  onClick={() => navigate(ROUTES.FORM_UPLOAD)}
                >
                  Upload Your First Form
                </Button>
              )}
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Forms;
