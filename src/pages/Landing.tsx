import { Button, Heading, Text, VStack, Center, Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES, APP_NAME, APP_DESCRIPTION } from '@/constants';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = (): void => {
    if (user) {
      navigate(ROUTES.DASHBOARD);
    } else {
      navigate(ROUTES.LOGIN);
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <VStack gap={8} textAlign="center" p={8}>
        <Heading size="2xl">{APP_NAME}</Heading>
        <VStack gap={4}>
          <Text fontSize="xl" color="gray.700" fontWeight="medium">
            {APP_DESCRIPTION}
          </Text>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Streamline your insurance operations with our comprehensive forms management system.
            Search, organize, and manage property & casualty insurance forms with intelligent
            metadata tracking and state-specific applicability.
          </Text>
        </VStack>
        {/* Modern Continue Button */}
        <Box mt={8}>
          <Button
            onClick={handleContinue}
            size="xl"
            px={12}
            py={6}
            fontSize="lg"
            fontWeight="semibold"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            rounded="full"
            shadow="xl"
            _hover={{
              transform: "translateY(-2px)",
              shadow: "2xl",
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.2s ease-in-out"
            border="none"
            position="relative"
            overflow="hidden"
          >
            Continue
          </Button>
        </Box>
      </VStack>
    </Center>
  );
};

export default Landing;