import { useFormContext } from "react-hook-form";
import { Container, Flex } from "@chakra-ui/react";
import ProfileInput from "./profileInput";
import AvailabilityInput from "./availabilityInput";
import Button from "../Button";

const Input = () => {
  const {
    formState: { isDirty, isSubmitting, isValid },
  } = useFormContext();

  return (
    <Container maxW="container.xl" p={0}>
      <Flex
        h={{ base: "auto", md: "100%" }}
        py={10}
        direction={{ base: "column", md: "row" }}
      >
        <ProfileInput />
        <AvailabilityInput />
      </Flex>
      <Container pr={10} maxW="xs">
        <Button disabled={!isDirty || !isValid || isSubmitting} type="submit">
          Save
        </Button>
      </Container>
    </Container>
  );
};

export default Input;
