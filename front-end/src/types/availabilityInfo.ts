import DaysOfWeek from "./daysOfWeek";
import Time from "./time";

type AvailabilityInfo = {
  timeZone?: string;
  location?: string;
  availableDays?: DaysOfWeek;
  from?: Time;
  to?: Time;
};

export default AvailabilityInfo;
