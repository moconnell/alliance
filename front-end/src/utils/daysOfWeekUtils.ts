import DayOfWeek from "../types/dayOfWeek";
import DaysOfWeek from "../types/daysOfWeek";

export const toDaysOfWeek = (day: DayOfWeek) =>
  DaysOfWeek[DayOfWeek[day] as keyof typeof DaysOfWeek];

export const isAvailable = (date: Date, availableDays: DaysOfWeek) => {
  const day = date.getDay();
  const daysOfWeek = 1 << day;
  
  return (daysOfWeek & availableDays) === daysOfWeek;
};
