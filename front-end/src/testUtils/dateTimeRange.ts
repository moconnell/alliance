import { DateTime } from "luxon";
import { range } from "../utils/range";

export const dateTimeRange = (
  start: number,
  end: number,
  intervalMinutes: 60 | 30 | 20 | 15 | 10 | 5 = 60,
  locale: string = "en-us"
) =>
  range(start, end).flatMap((hour) =>
    range(0, 60 / intervalMinutes - 1).map((i) =>
      DateTime.fromObject({ hour, minute: i * intervalMinutes }).setLocale(
        locale
      )
    )
  );
