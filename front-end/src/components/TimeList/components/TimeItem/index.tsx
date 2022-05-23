import { DateTime } from "luxon";
import { TimeButton } from "./styles";

interface TimeItemProps {
  value: DateTime;
  active: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const TimeItem = ({ value, active, onClick }: TimeItemProps) => (
  <TimeButton
    onClick={onClick}
    style={{ backgroundColor: active ? "#ff3864" : "transparent" }}
  >
    {value.toLocaleString(DateTime.TIME_SIMPLE)}
  </TimeButton>
);

export default TimeItem;
