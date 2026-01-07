import { Transaction, Budget } from '../types';

const TRANSACTIONS_KEY = 'expense-tracker-transactions';
const BUDGET_KEY = 'expense-tracker-budget';

export function getTransactions(): Transaction[] {
  try {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading transactions:', error);
    return [];
  }
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transactions:', error);
  }
}

export function getBudget(): Budget | null {
  try {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading budget:', error);
    return null;
  }
}

export function saveBudget(budget: Budget): void {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budget));
  } catch (error) {
    console.error('Error saving budget:', error);
  }
}
