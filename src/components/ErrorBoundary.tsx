import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Box, Heading, Text, Button, VStack, Center } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Center minH="100vh" p={8}>
          <VStack gap={6} textAlign="center" maxW="md">
            <Heading size="lg" color="red.500">
              Something went wrong
            </Heading>
            <Text color="gray.600">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Text>
            {this.state.error && (
              <Box
                p={4}
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="md"
                fontSize="sm"
                fontFamily="mono"
                color="red.700"
                maxW="full"
                overflow="auto"
              >
                {this.state.error.message}
              </Box>
            )}
            <VStack gap={3}>
              <Button colorPalette="blue" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </VStack>
          </VStack>
        </Center>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
