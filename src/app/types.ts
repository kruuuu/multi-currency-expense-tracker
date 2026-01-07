export type Currency = 'EUR' | 'INR';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  category: string;
  date: string;
  createdAt: number;
}

export interface Budget {
  amount: number;
  currency: Currency;
}
