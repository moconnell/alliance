export const toBooleanArray = (binary: number, length: number = 0) =>
  Math.abs(binary)
    .toString(2)
    .padStart(length, "0")
    .split("")
    .map(Number)
    .map(Boolean);
