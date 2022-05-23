import Time from "../types/time";

const locale =
  process.env.REACT_LOCALE ?? Intl.DateTimeFormat().resolvedOptions().locale;

const dateTimeFormat = Intl.DateTimeFormat(locale, {
  dateStyle: "full",
  timeStyle: "short",
});

const shortTimeFormat = Intl.DateTimeFormat(locale, {
  timeStyle: "short",
});

function isTime(value: Time | Date): value is Time {
  return (value as Time).hours !== undefined;
}

const toDate = (t: Time) => {
  let d = new Date();
  d.setHours(t.hours, t.minutes);
  return d;
};

export const formatTime = (value: Time | Date) => {
  return shortTimeFormat.format(isTime(value) ? toDate(value) : value);
};

export const formatDateTime = (value: Date) => {
  return dateTimeFormat.format(value);
};
