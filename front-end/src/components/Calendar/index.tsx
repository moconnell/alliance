import "./styles.css";
import ReactCalendar, {
  OnChangeDateCallback,
  OnChangeDateRangeCallback,
} from "react-calendar";

interface CalendarProps {
  onChange?: OnChangeDateCallback | OnChangeDateRangeCallback;
  defaultValue?: Date | Date[];
  tileDisabled?: (date: Date) => boolean;
}

const Calendar = ({
  onChange,
  defaultValue = new Date(),
  tileDisabled = () => false,
}: CalendarProps) => (
  <ReactCalendar
    onChange={onChange}
    defaultValue={defaultValue}
    tileDisabled={({ date }) => tileDisabled(date)}
  />
);

export default Calendar;
