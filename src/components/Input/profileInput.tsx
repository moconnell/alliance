import {
  VStack,
  Input,
  Heading,
  GridItem,
  FormControl,
  FormLabel,
  SimpleGrid,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

const ProfileInput = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <VStack w="full" h="full" p={10} alignItems="felx-start" spacing={10}>
      <VStack spacing={3} alignItems="felx-start">
        <Heading color="raid.50" size="1xs">
          Profile
        </Heading>
      </VStack>
      <SimpleGrid columns={2} columnGap={3} rowGap={3} w="full">
        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel id="form-label">Email</FormLabel>
            <Input
              placeholder="your@email.com"
              {...register("email", {
                required: true,
                pattern: {
                  value: /^.+@.{2,}$/i,
                  message: "invalid email address",
                },
              })}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel id="form-label">Public User Name</FormLabel>
            <Input placeholder="User Meme" {...register("username", {})} />
            <FormErrorMessage>{errors.username}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl>
            <FormLabel id="form-label">Description</FormLabel>
            <Input placeholder="I'm a Monk!" {...register("description", {})} />
            <FormErrorMessage>{errors.description}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default ProfileInput;
