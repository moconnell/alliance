export function shortenAddress(address?: string) {
  if (!address) return address;
  const length = address.length;
  return `${address.slice(0, 5)}..${address.slice(length - 4, length)}`;
}
