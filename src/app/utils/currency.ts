import { Currency } from '../types';

// Exchange rates (EUR to INR)
// In a real app, this would be fetched from an API
export const EXCHANGE_RATES = {
  EUR: 1,
  INR: 90.5, // 1 EUR = 90.5 INR (approximate)
};

export function convertCurrency(
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to EUR first (as base currency)
  const amountInEUR = amount / EXCHANGE_RATES[fromCurrency];
  
  // Then convert to target currency
  return amountInEUR * EXCHANGE_RATES[toCurrency];
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));
  
  const symbol = currency === 'EUR' ? '€' : '₹';
  
  return `${symbol}${formatted}`;
}
