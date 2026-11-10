export function formatServicePrice(price: number, currency: string): string {
  return `${new Intl.NumberFormat('en-US').format(price)} ${currency}`;
}
