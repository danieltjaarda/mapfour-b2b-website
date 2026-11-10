export function formatEuro(cents: number, intl: string, decimals = false) {
  return new Intl.NumberFormat(intl, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  }).format(cents / 100);
}

export function formatNumber(n: number, intl: string, maxFractionDigits = 1) {
  return new Intl.NumberFormat(intl, { maximumFractionDigits: maxFractionDigits }).format(n);
}
