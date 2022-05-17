import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import DaysOfWeek from "../../types/daysOfWeek";
import AvailableDaysButton from "./AvailableDaysButton";

const orderedDaysOfWeek = [
  DaysOfWeek.Monday,
  DaysOfWeek.Tuesday,
  DaysOfWeek.Wednesday,
  DaysOfWeek.Thursday,
  DaysOfWeek.Friday,
  DaysOfWeek.Saturday,
  DaysOfWeek.Sunday,
];
interface AvailableDaysProps {
  value?: DaysOfWeek;
  onChange?: (value: DaysOfWeek) => void;
}

const AvailableDays = ({
  value = DaysOfWeek.None,
  onChange,
}: AvailableDaysProps) => {
  const [availability, setAvailability] = useState(value);

  useEffect(() => {
    setAvailability(value);
  }, [value]);

  const handleSelect = (day: DaysOfWeek) => {
    const newAvailability = availability ^ day;
    setAvailability(newAvailability);
    if (onChange) onChange(newAvailability);
  };

  return (
    <Flex direction={{ base: "row" }}>
      {orderedDaysOfWeek.map((day) => (
        <AvailableDaysButton
          day={day}
          key={day}
          selected={(day & availability) === day}
          onSelect={handleSelect}
        />
      ))}
    </Flex>
  );
};

export default AvailableDays;
