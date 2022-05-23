import Time from "../types/time";
import assert from "assert";

export const totalMinutes = (t: Time) => t.hours * 60 + t.minutes;

export const totalSeconds = (t: Time) =>
  t.hours * 60 * 60 + t.minutes * 60 + (t.seconds ?? 0);

export const fromTotalMins = (mins: number) => {
  const hours = Math.floor(mins / 60) % 24;
  const minutes = mins % 60;
  assert(hours < 24);
  assert(minutes < 60);
  return { hours, minutes } as Time;
};

export const assertValid = (t?: Time) => {
  assert(t, "time undefined");
  assert(t.hours >= 0 && t.hours < 24, "invalid hours");
  assert(t.minutes >= 0 && t.minutes < 60, "invalid minutes");
};

export const compare = (t1: Time, t2: Time) => {
  const s1 = totalSeconds(t1);
  const s2 = totalSeconds(t2);
  if (s1 === s2) return 0;
  if (s1 < s2) return -1;
  return 1;
};

export const tomorrow = () => {
  let d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
};
