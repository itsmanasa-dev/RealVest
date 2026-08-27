/**
 * RealVest Currency & Financial Formatting Utilities
 * Standardized for Indian Real Estate (INR: ₹ Lakhs, ₹ Crores, ₹/month)
 */

export function formatInrLakhs(lakhs: number): string {
  if (lakhs >= 100) {
    const cr = (lakhs / 100).toFixed(2);
    return `₹${parseFloat(cr)} Cr`;
  }
  return `₹${lakhs.toFixed(1)} L`;
}

export function formatInrRent(monthlyRentInr: number): string {
  if (monthlyRentInr >= 100000) {
    const l = (monthlyRentInr / 100000).toFixed(2);
    return `₹${parseFloat(l)} L/mo`;
  }
  return `₹${monthlyRentInr.toLocaleString('en-IN')}/mo`;
}

export function formatInrAmount(amountInr: number): string {
  if (amountInr >= 10000000) {
    const cr = (amountInr / 10000000).toFixed(2);
    return `₹${parseFloat(cr)} Cr`;
  }
  if (amountInr >= 100000) {
    const l = (amountInr / 100000).toFixed(2);
    return `₹${parseFloat(l)} Lakhs`;
  }
  return `₹${amountInr.toLocaleString('en-IN')}`;
}

export function formatPercent(pct: number, includeSign: boolean = false): string {
  const sign = includeSign && pct > 0 ? '+' : '';
  return `${sign}${pct.toFixed(1)}%`;
}
