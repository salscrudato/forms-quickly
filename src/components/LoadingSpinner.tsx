import { Spinner, Center, VStack, Text } from '@chakra-ui/react';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner = ({
  size = 'md',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const content = (
    <VStack gap={4}>
      <Spinner
        size={size}
        color="blue.500"
      />
      {message && (
        <Text fontSize="sm" color="gray.600" textAlign="center">
          {message}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Center minH="100vh" w="full">
        {content}
      </Center>
    );
  }

  return content;
};

export default LoadingSpinner;
