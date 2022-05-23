import Button from "./components/Button";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ff3864;
  border-radius: 6px;
  role: alert;
`;

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: ErrorFallbackProps) => (
  <Container>
    <p>Something went wrong:</p>
    <pre>{error.message}</pre>
    <Button onClick={resetErrorBoundary}>Return Home</Button>
  </Container>
);

export default ErrorFallback;
