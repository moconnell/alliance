import { Spinner, Progress } from "@chakra-ui/react";
import {
  Container,
  TextAndIconContainer,
  IconContainer,
  Text,
  ProgressBarContainer,
  MainContent,
} from "./styles";
import { ReactComponent as DoubleCheck } from "../../../../assets/double-check.svg";

interface LoadingTransactionProps {
  loading?: boolean;
  progress?: number;
}

const LoadingTransaction = ({
  loading = true,
  progress,
}: LoadingTransactionProps) => (
  <Container>
    <MainContent>
      <TextAndIconContainer>
        <IconContainer>
          {loading ? <Spinner size={"md"} color="#FF3864" /> : <DoubleCheck />}
        </IconContainer>

        <Text>
          {loading
            ? "Your transaction is processing..."
            : "Yay, your transaction is complete!"}
        </Text>
      </TextAndIconContainer>
    </MainContent>

    <ProgressBarContainer>
      <Progress
        value={loading ? progress : 100}
        colorScheme="red"
        height="3px"
        isIndeterminate={loading}
      />
    </ProgressBarContainer>
  </Container>
);

export default LoadingTransaction;
