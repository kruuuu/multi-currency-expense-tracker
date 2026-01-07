import { Wallet, TrendingUp, TrendingDown, ArrowLeftRight } from 'lucide-react';
import { Transaction, Currency } from '../types';
import { convertCurrency, formatCurrency } from '../utils/currency';

interface BalanceSummaryProps {
  transactions: Transaction[];
  displayCurrency: Currency;
}

export function BalanceSummary({ transactions, displayCurrency }: BalanceSummaryProps) {
  const calculateTotals = () => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      const amountInDisplayCurrency = convertCurrency(
        transaction.amount,
        transaction.currency,
        displayCurrency
      );

      if (transaction.type === 'income') {
        totalIncome += amountInDisplayCurrency;
      } else {
        totalExpense += amountInDisplayCurrency;
      }
    });

    const balance = totalIncome - totalExpense;

    return { totalIncome, totalExpense, balance };
  };

  const { totalIncome, totalExpense, balance } = calculateTotals();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Balance Card */}
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/30">
              <Wallet size={20} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(balance, displayCurrency)}</p>
          <p className="text-sm text-gray-500">Current balance in {displayCurrency}</p>
        </div>
      </div>

      {/* Income Card */}
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Income</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalIncome, displayCurrency)}</p>
          <p className="text-sm text-gray-500">Total earnings</p>
        </div>
      </div>

      {/* Expenses Card */}
      <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-red-600 rounded-xl shadow-lg shadow-rose-500/30">
              <TrendingDown size={20} className="text-white" />
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(totalExpense, displayCurrency)}</p>
          <p className="text-sm text-gray-500">Total spending</p>
        </div>
      </div>
    </div>
  );
}