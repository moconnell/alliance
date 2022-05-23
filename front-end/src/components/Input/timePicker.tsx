import { Select } from "@chakra-ui/react";
import { useMemo } from "react";
import Time from "../../types/time";
import { formatTime } from "../../utils/formatDate";
import { range } from "../../utils/range";
import { fromTotalMins, totalMinutes } from "../../utils/timeUtils";

interface TimePickerProps {
  name: string;
  prefix?: string;
  timeIntervalMins?: number;
  value?: Time;
  disabledPredicate?: (mins: number) => boolean;
  onChange?: (value: Time) => void;
}

const TimePicker = ({
  name,
  value,
  disabledPredicate = () => false,
  prefix = name.substring(0, 1),
  timeIntervalMins = 30,
  onChange,
}: TimePickerProps) => {
  const options = useMemo(() => {
    const times = range(0, 23).flatMap((hours) =>
      range(0, 60 / timeIntervalMins - 1).map((i) => {
        return { hours, minutes: i * timeIntervalMins };
      })
    );

    return times.map((t) => {
      const mins = totalMinutes(t);
      return (
        <option
          key={`${prefix}${mins}`}
          value={mins}
          disabled={disabledPredicate(mins)}
        >
          {formatTime(t)}
        </option>
      );
    });
  }, [disabledPredicate, prefix, timeIntervalMins]);

  return (
    <Select
      data-testid={`select:${name}`}
      name={name}
      value={value ? totalMinutes(value) : undefined}
      onChange={(e) => {
        if (onChange) onChange(fromTotalMins(Number(e.target.value)));
      }}
    >
      {options}
    </Select>
  );
};

export default TimePicker;
