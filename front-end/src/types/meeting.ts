import { DateTime } from "luxon";

type Meeting = {
  date: DateTime;
  endDate: DateTime;
  attendee: string;
  description: string;
};

export default Meeting;
