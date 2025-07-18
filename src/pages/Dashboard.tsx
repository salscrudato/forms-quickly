import { useState } from 'react';
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
  IconButton,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES, APP_NAME } from '@/constants';
import type { FormSearchFilters } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FormSearchFilters>({});

  // Mock forms data - same as Forms page
  const mockForms = [
    {
      id: '1',
      title: 'Commercial General Liability Application',
      description: 'Standard application form for commercial general liability insurance',
      formNumber: 'CGL-001-CA',
      category: 'Application' as const,
      stateApplicability: ['CA', 'NV', 'AZ'],
      editionDate: '2024-01-15T00:00:00Z',
      effectiveDate: '2024-02-01T00:00:00Z',
      isActive: true,
      tags: ['liability', 'commercial', 'application'],
      version: '2024.1',
      lineOfBusiness: 'General Liability' as const,
      lastModified: '2024-01-15T10:30:00Z',
      modifiedBy: 'user123',
      fileSize: 245760,
    },
    {
      id: '2',
      title: 'Workers Compensation Policy Form',
      description: 'Standard policy form for workers compensation coverage',
      formNumber: 'WC-POL-002-TX',
      category: 'Policy' as const,
      stateApplicability: ['TX', 'OK', 'LA'],
      editionDate: '2024-01-10T00:00:00Z',
      effectiveDate: '2024-01-15T00:00:00Z',
      isActive: true,
      tags: ['workers comp', 'policy', 'texas'],
      version: '2024.1',
      lineOfBusiness: 'Workers Compensation' as const,
      lastModified: '2024-01-10T14:20:00Z',
      modifiedBy: 'user456',
      fileSize: 189440,
    },
    {
      id: '3',
      title: 'Auto Liability Endorsement - Excluded Driver',
      description: 'Endorsement to exclude specific drivers from auto liability coverage',
      formNumber: 'AUTO-END-003-NY',
      category: 'Endorsement' as const,
      stateApplicability: ['NY', 'NJ', 'CT'],
      editionDate: '2024-01-08T00:00:00Z',
      effectiveDate: '2024-01-20T00:00:00Z',
      expirationDate: '2025-01-20T00:00:00Z',
      isActive: false,
      tags: ['auto', 'endorsement', 'excluded driver'],
      version: '2023.3',
      lineOfBusiness: 'Auto' as const,
      lastModified: '2024-01-08T09:15:00Z',
      modifiedBy: 'user789',
      fileSize: 156672,
    },
  ];

  // Filter forms based on search query
  const filteredForms = mockForms.filter(form => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      form.title.toLowerCase().includes(query) ||
      form.formNumber.toLowerCase().includes(query) ||
      form.description?.toLowerCase().includes(query) ||
      form.tags.some(tag => tag.toLowerCase().includes(query)) ||
      form.category.toLowerCase().includes(query) ||
      form.lineOfBusiness.toLowerCase().includes(query)
    );
  });

  const handleSignOut = async () => {
    // This will be implemented with the auth hook
    navigate(ROUTES.HOME);
  };

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" px={6} py={4}>
        <Flex justify="space-between" align="center">
          <HStack gap={3}>
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

          <HStack gap={4}>
            <Text fontSize="sm" color="gray.600">
              Welcome, {user?.email || 'Guest'}
            </Text>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
          </HStack>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box p={6}>
        <VStack gap={8} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center" py={8}>
            <Heading size="2xl" mb={4} color="gray.800">
              Forms Library
            </Heading>
            <Text fontSize="lg" color="gray.600" mb={8}>
              Search, manage, and organize your property & casualty insurance forms
            </Text>

            {/* Dynamic Search */}
            <Box maxW="600px" mx="auto">
              <Input
                placeholder="Search forms by title, number, category, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                bg="white"
                shadow="sm"
                border="2px solid"
                borderColor="gray.200"
                _focus={{
                  borderColor: "blue.400",
                  shadow: "md"
                }}
              />
            </Box>
          </Box>





          {/* Forms Library */}
          <Box>
            <Flex justify="space-between" align="center" mb={6}>
              <Heading size="lg">
                {searchQuery ? `Search Results (${filteredForms.length})` : `All Forms (${filteredForms.length})`}
              </Heading>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
            </Flex>

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
                  {searchQuery ? 'No forms found matching your search' : 'No forms available'}
                </Text>
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </VStack>
      </Box>

      {/* Floating Add Form Button */}
      <Button
        position="fixed"
        bottom="6"
        right="6"
        size="lg"
        colorPalette="blue"
        rounded="full"
        shadow="xl"
        px={6}
        py={6}
        fontSize="lg"
        fontWeight="semibold"
        _hover={{
          transform: "translateY(-2px)",
          shadow: "2xl",
        }}
        _active={{
          transform: "translateY(0px)",
        }}
        transition="all 0.2s ease-in-out"
        onClick={() => navigate(ROUTES.FORM_UPLOAD)}
        zIndex="tooltip"
      >
        + Add Form
      </Button>
    </Box>
  );
};

export default Dashboard;
