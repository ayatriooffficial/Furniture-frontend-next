// Small price utilities: round amounts to 2 decimals and format as string
export function roundToTwo(value) {
  const n = Number(value) || 0;
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function formatPrice(value) {
  if (value === null || value === undefined || value === "-") return value;
  const n = roundToTwo(Number(value));
  return n.toFixed(2);
}

export default { roundToTwo, formatPrice };
