import {
  Heading,
  Input,
  VStack,
  SimpleGrid,
  GridItem,
  FormControl,
  FormLabel,
  Select,
  useBreakpointValue,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import DaysOfWeek from "../../types/daysOfWeek";
import Time from "../../types/time";
import { totalMinutes } from "../../utils/timeUtils";
import AvailableDays from "../AvailableDays";
import "./styles.css";
import TimePicker from "./timePicker";
import { timeZones } from "./timeZones";

const AvailabilityInput = () => {
  const { control, register } = useFormContext();

  const colSpan = useBreakpointValue({ base: 2, md: 1 });

  const from = useWatch({ control, name: "from" }) as Time;
  const to = useWatch({ control, name: "to" }) as Time;

  return (
    <VStack w="full" h="full" p={10} alignItems="flex-start" spacing={10}>
      <VStack spacing={3} alignItems="flex-start">
        <Heading color="raid.50" size="1xs">
          Availability
        </Heading>
      </VStack>
      <SimpleGrid columns={2} columnGap={3} rowGap={3} w="full">
        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel id="form-label">Time Zone</FormLabel>
            <Select
              placeholder="Select TZ"
              {...register("timeZone", { required: true })}
            >
              {timeZones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz.replaceAll("_", " ")}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>

        <GridItem colSpan={2}>
          <FormControl isRequired>
            <FormLabel id="form-label">Location</FormLabel>
            <Input {...register("location", { required: true })} />
          </FormControl>
        </GridItem>

        <GridItem colSpan={colSpan}>
          <FormControl isRequired>
            <FormLabel id="form-label">From</FormLabel>
            <Controller
              control={control}
              name="from"
              render={({ field: { onChange, name, value } }) => (
                <TimePicker
                  name={name}
                  value={value}
                  disabledPredicate={(mins) => to && mins >= totalMinutes(to)}
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={colSpan}>
          <FormControl isRequired>
            <FormLabel id="form-label">To</FormLabel>
            <Controller
              control={control}
              name="to"
              render={({ field: { onChange, name, value } }) => (
                <TimePicker
                  name={name}
                  value={value}
                  disabledPredicate={(mins) =>
                    from && mins <= totalMinutes(from)
                  }
                  onChange={onChange}
                />
              )}
            />
          </FormControl>
        </GridItem>

        <GridItem colSpan={colSpan}>
          <FormControl isRequired>
            <FormLabel id="form-label">Days</FormLabel>
            <FormErrorMessage>Must select at least one day</FormErrorMessage>
            <Controller
              name="availableDays"
              render={({ field: { onChange, value } }) => (
                <AvailableDays value={value} onChange={onChange} />
              )}
              rules={{ min: DaysOfWeek.Monday }}
            />
          </FormControl>
        </GridItem>
      </SimpleGrid>
    </VStack>
  );
};

export default AvailabilityInput;
