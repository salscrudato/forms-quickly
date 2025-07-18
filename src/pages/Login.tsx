import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  Heading,
  Center,
  HStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '@/hooks/useAuthActions';
import { ROUTES } from '@/constants';

const Login = () => {
  const navigate = useNavigate();
  const { loading, error, signInAsGuest } = useAuthActions();

  const handleGoogleLogin = async (): Promise<void> => {
    try {
      // TODO: Implement Google authentication with Firebase
      console.log('Google login clicked');
      // For demo purposes, navigate to dashboard
      // In production, this would use Firebase Google Auth
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGuestLogin = async (): Promise<void> => {
    try {
      await signInAsGuest();
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.error('Guest login error:', error);
      // Error is handled by the hook
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box
        maxW="md"
        w="full"
        bg="white"
        boxShadow="xl"
        rounded="2xl"
        p={10}
        mx={4}
        border="1px solid"
        borderColor="gray.100"
      >
        <VStack gap={8}>
          {/* Header */}
          <VStack gap={3} textAlign="center">
            <Heading size="xl" color="gray.800">
              Welcome Back
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Choose your preferred way to continue
            </Text>
          </VStack>

          {error && (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              color="red.700"
              px={4}
              py={3}
              rounded="lg"
              fontSize="sm"
              w="full"
              textAlign="center"
            >
              {error}
            </Box>
          )}

          {/* Google Sign In Button */}
          <Button
            onClick={handleGoogleLogin}
            size="xl"
            w="full"
            py={6}
            fontSize="lg"
            fontWeight="semibold"
            bg="white"
            color="gray.700"
            border="2px solid"
            borderColor="gray.200"
            rounded="xl"
            shadow="sm"
            _hover={{
              borderColor: "gray.300",
              shadow: "md",
              transform: "translateY(-1px)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.2s ease-in-out"
            disabled={loading}
            position="relative"
          >
            <HStack gap={3} alignItems="center">
              <Box
                w="6"
                h="6"
                bg="linear-gradient(45deg, #4285f4, #34a853, #fbbc05, #ea4335)"
                rounded="md"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontSize="sm" fontWeight="bold">
                  G
                </Text>
              </Box>
              <Text>Continue with Google</Text>
            </HStack>
          </Button>

          {/* Divider */}
          <HStack w="full" py={2}>
            <Box flex="1" h="1px" bg="gray.200" />
            <Text fontSize="sm" color="gray.400" px={4} fontWeight="medium">
              OR
            </Text>
            <Box flex="1" h="1px" bg="gray.200" />
          </HStack>

          {/* Guest Sign In Button */}
          <Button
            onClick={handleGuestLogin}
            size="xl"
            w="full"
            py={6}
            fontSize="lg"
            fontWeight="semibold"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            color="white"
            rounded="xl"
            shadow="lg"
            _hover={{
              transform: "translateY(-1px)",
              shadow: "xl",
              bg: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
            }}
            _active={{
              transform: "translateY(0px)",
            }}
            transition="all 0.2s ease-in-out"
            disabled={loading}
            loading={loading}
            loadingText="Signing in..."
          >
            Continue as Guest
          </Button>

          {/* Footer */}
          <Text fontSize="sm" color="gray.500" textAlign="center" mt={4}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </VStack>
      </Box>
    </Center>
  );
};

export default Login;